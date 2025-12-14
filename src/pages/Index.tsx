import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryCard } from "@/components/CategoryCard";
import { CategoryDetailDialog } from "@/components/CategoryDetailDialog";
import { PromptPreview } from "@/components/PromptPreview";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsDialog } from "@/components/SettingsDialog";
import { CommandPalette } from "@/components/CommandPalette";
import { HistoryDialog } from "@/components/HistoryDialog";
import { TemplateDialog } from "@/components/TemplateDialog";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { Undo, Redo } from "lucide-react";
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableCategoryCard } from "@/components/SortableCategoryCard";

interface Term {
  text: string;
  image?: string;
}

interface Subcategory {
  id: string;
  name: string;
  terms: Term[];
}

interface Category {
  id: string;
  name: string;
  terms: Term[];
  // subcategories?: Subcategory[]; // Removed: we no longer support subcategories
}

interface Project {
  id: string;
  name: string;
  categories: Category[];
}

const Index = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>(() => {
    const defaultProjects: Project[] = [
      {
        id: "1",
        name: "Private",
        categories: [
          {
            id: "1",
            name: "Objekt",
            terms: [
              { text: "house" },
              { text: "car" },
              { text: "tree" },
              { text: "mountain" },
            ],
          },
          {
            id: "2",
            name: "Farben",
            terms: [
              { text: "yellow roof" },
              { text: "blue sky" },
              { text: "green grass" },
            ],
          },
        ],
      },
      {
        id: "2",
        name: "Work",
        categories: [
          {
            id: "3",
            name: "Stimmung",
            terms: [
              { text: "professional" },
              { text: "clean" },
              { text: "modern" },
            ],
          },
        ],
      },
    ];

    try {
      const stored = localStorage.getItem("projects");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed as Project[];
        }
      }
    } catch (e) {
      console.error("Failed to load projects from storage", e);
    }
    return defaultProjects;
  });
  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    const stored = localStorage.getItem("activeProjectId");
    return stored || projects[0]?.id || "";
  });

  const {
    state: selectedTerms,
    setState: setSelectedTerms,
    undo,
    redo,
    canUndo,
    canRedo
  } = useUndoRedo<string[]>(() => {
    try {
      const stored = localStorage.getItem("selectedTerms");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed as string[];
        }
      }
    } catch (e) {
      console.error("Failed to load selected terms from storage", e);
    }
    return [];
  });

  // New: Negative Prompt State
  const {
    state: selectedNegativeTerms,
    setState: setSelectedNegativeTerms,
    undo: undoNegative,
    redo: redoNegative,
    canUndo: canUndoNegative,
    canRedo: canRedoNegative
  } = useUndoRedo<string[]>(() => {
    try {
      const stored = localStorage.getItem("selectedNegativeTerms");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed as string[];
        }
      }
    } catch (e) {
      console.error("Failed to load selected negative terms from storage", e);
    }
    return [];
  });
  const [activePromptMode, setActivePromptMode] = useState<"positive" | "negative">("positive");

  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [showNewProject, setShowNewProject] = useState(false);
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [deleteProjectDialog, setDeleteProjectDialog] = useState<{
    open: boolean;
    projectId?: string;
  }>({ open: false });

  const activeProject = projects.find((p) => p.id === activeProjectId);
  const openCategory = activeProject?.categories.find((c) => c.id === openCategoryId);

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: newProjectName.trim(),
        categories: [],
      };
      setProjects([...projects, newProject]);
      setNewProjectName("");
      setShowNewProject(false);
      setActiveProjectId(newProject.id);
      toast.success(t('projectAdded'));
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId));
    if (activeProjectId === projectId && projects.length > 1) {
      setActiveProjectId(projects.find((p) => p.id !== projectId)!.id);
    }
    toast.success(t('projectDeleted'));
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() && activeProject) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        terms: [],
        // subcategories: [], // Removed: no subcategories
      };
      setProjects(
        projects.map((p) =>
          p.id === activeProjectId
            ? { ...p, categories: [...p.categories, newCategory] }
            : p
        )
      );
      setNewCategoryName("");
      setShowNewCategory(false);
      toast.success(t('categoryAdded'));
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setProjects(
      projects.map((p) =>
        p.id === activeProjectId
          ? {
            ...p,
            categories: p.categories.filter((cat) => cat.id !== categoryId),
          }
          : p
      )
    );
    toast.success(t('categoryDeleted'));
  };

  const handleAddTerm = (categoryId: string, term: string, image?: string) => {
    setProjects(
      projects.map((p) =>
        p.id === activeProjectId
          ? {
            ...p,
            categories: p.categories.map((cat) =>
              cat.id === categoryId
                ? { ...cat, terms: [...cat.terms, { text: term, image }] }
                : cat
            ),
          }
          : p
      )
    );
    toast.success(t('termAdded'));
  };

  // This removes a term from a CATEGORY (Data)
  const handleRemoveTermFromCategory = (categoryId: string, term: string) => {
    setProjects(
      projects.map((p) =>
        p.id === activeProjectId
          ? {
            ...p,
            categories: p.categories.map((cat) =>
              cat.id === categoryId
                ? {
                  ...cat,
                  terms: cat.terms.filter((t) => t.text !== term),
                }
                : cat
            ),
          }
          : p
      )
    );
    // Also remove from selection if present? Optional, but safer to leave selection alone or remove it.
    // Let's leave it in selection for now, or remove it.
    // handleRemoveSelectedTerm(term); 
  };

  // handleAddSubcategory removed
  // handleDeleteSubcategory removed

  // Rename Category
  const handleRenameCategory = (categoryId: string, newName: string) => {
    setProjects(
      projects.map((p) =>
        p.id === activeProjectId
          ? {
            ...p,
            categories: p.categories.map((cat) =>
              cat.id === categoryId ? { ...cat, name: newName } : cat
            ),
          }
          : p
      )
    );
  };

  // Edit term in main category
  const handleEditTerm = (categoryId: string, oldText: string, newText: string, newImage?: string) => {
    setProjects(
      projects.map((p) =>
        p.id === activeProjectId
          ? {
            ...p,
            categories: p.categories.map((cat) =>
              cat.id === categoryId
                ? {
                  ...cat,
                  terms: cat.terms.map((t) =>
                    t.text === oldText ? { text: newText, image: newImage } : t
                  ),
                }
                : cat
            ),
          }
          : p
      )
    );
    // update selection if term text changed
    if (oldText !== newText) {
      if (selectedTerms.includes(oldText)) {
        setSelectedTerms((prev) => prev.map((t) => (t === oldText ? newText : t)));
      }
      if (selectedNegativeTerms.includes(oldText)) {
        setSelectedNegativeTerms((prev) => prev.map((t) => (t === oldText ? newText : t)));
      }
    }
  };

  // handleEditTermInSubcategory removed
  // handleAddTermToSubcategory removed
  // handleRemoveTermFromSubcategory removed

  // -- SELECTION HANDLERS --

  // Toggles selection (Add/Remove from Active List)
  const handleTermClick = (term: string) => {
    if (activePromptMode === "positive") {
      if (selectedTerms.includes(term)) {
        setSelectedTerms(selectedTerms.filter((t) => t !== term));
      } else {
        setSelectedTerms((prev) => [...prev, term]);
      }
    } else {
      if (selectedNegativeTerms.includes(term)) {
        setSelectedNegativeTerms(selectedNegativeTerms.filter((t) => t !== term));
      } else {
        setSelectedNegativeTerms((prev) => [...prev, term]);
      }
    }
  };

  // Removes from the *Active* Selection List (for the X button in Preview)
  const handleRemoveSelectedTerm = (term: string) => {
    if (activePromptMode === "positive") {
      const newTerms = selectedTerms.filter((t) => t !== term);
      setSelectedTerms(newTerms);
    } else {
      const newTerms = selectedNegativeTerms.filter((t) => t !== term);
      setSelectedNegativeTerms(newTerms);
    }
  };

  const handleClearSelection = () => {
    if (activePromptMode === "positive") setSelectedTerms([]);
    else setSelectedNegativeTerms([]);
    toast.success(t('selectionCleared'));
  };

  const handleDragEndCategory = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id && activeProject) {
      const oldIndex = activeProject.categories.findIndex((cat) => cat.id === active.id);
      const newIndex = activeProject.categories.findIndex((cat) => cat.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        setProjects(
          projects.map((p) =>
            p.id === activeProjectId
              ? {
                ...p,
                categories: arrayMove(p.categories, oldIndex, newIndex),
              }
              : p
          )
        );
      }
    }
  };

  const handleUpdateSelectedTerm = (oldTerm: string, newTerm: string) => {
    // Check both lists or use active mode?
    // Since we drag/update in the active list, we should target active mode OR search both.
    // Safer to search both because sometimes UI might be desync (rare) but let's trust mode.

    if (activePromptMode === "positive") {
      setSelectedTerms((prev) =>
        prev.map(t => t === oldTerm ? newTerm : t)
      );
    } else {
      setSelectedNegativeTerms((prev) =>
        prev.map(t => t === oldTerm ? newTerm : t)
      );
    }
  };

  const handleLoadTemplate = (terms: string[]) => {
    setSelectedTerms(terms);
  };

  const handleReorderTerms = (categoryId: string, oldIndex: number, newIndex: number) => {
    setProjects(
      projects.map((p) =>
        p.id === activeProjectId
          ? {
            ...p,
            categories: p.categories.map((cat) =>
              cat.id === categoryId
                ? {
                  ...cat,
                  terms: arrayMove(cat.terms, oldIndex, newIndex),
                }
                : cat
            ),
          }
          : p
      )
    );
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prompt-builder-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            setProjects(data);
            toast.success(t('dataImported'));
          } catch (error) {
            toast.error(t('dataExportError'));
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearAllData = () => {
    setProjects([]);
    setSelectedTerms([]);
    toast.success(t('allDataCleared'));
  };

  // Load from file-based storage on mount (if available)
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch('/api/data');
        if (resp.ok) {
          const data = await resp.json();
          if (data && Array.isArray(data.projects)) {
            setProjects(data.projects as Project[]);
          }
          if (typeof data.activeProjectId === 'string') {
            setActiveProjectId(data.activeProjectId);
          }
          if (Array.isArray(data.selectedTerms)) {
            setSelectedTerms(data.selectedTerms as string[]);
          }
        }
      } catch (e) {
        // ignore if not available
      }
    })();
  }, []);

  // Auto-save changes to localStorage when enabled
  useEffect(() => {
    const autoSaveEnabled = localStorage.getItem("autoSave") !== "false";
    if (!autoSaveEnabled) return;
    try {
      localStorage.setItem("projects", JSON.stringify(projects));
      localStorage.setItem("selectedTerms", JSON.stringify(selectedTerms));
      if (activeProjectId) {
        localStorage.setItem("activeProjectId", activeProjectId);
      } else {
        localStorage.removeItem("activeProjectId");
      }
    } catch (e) {
      console.error("AutoSave failed", e);
    }
  }, [projects, selectedTerms, activeProjectId]);

  // Save to file-based storage when things change
  useEffect(() => {
    (async () => {
      try {
        const payload = {
          projects,
          activeProjectId,
          selectedTerms,
        };
        await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        // ignore in dev
      }
    })();
  }, [projects, selectedTerms, activeProjectId]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {t('appTitle')}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {t('appSubtitle')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={undo}
                disabled={!canUndo}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={redo}
                disabled={!canRedo}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
              <TemplateDialog
                currentTerms={selectedTerms}
                onLoadTemplate={handleLoadTemplate}
              />
              <HistoryDialog />
              <SettingsDialog
                onExport={handleExportData}
                onImport={handleImportData}
                onClearData={handleClearAllData}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Prompt Preview & Selection */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <PromptPreview
              selectedTerms={selectedTerms}
              selectedNegativeTerms={selectedNegativeTerms}
              activeMode={activePromptMode}
              onModeChange={setActivePromptMode}
              onClear={handleClearSelection}
              onRemoveTerm={handleRemoveSelectedTerm}
              onReorder={(newOrder) => {
                if (activePromptMode === "positive") setSelectedTerms(newOrder);
                else setSelectedNegativeTerms(newOrder);
              }}
              onUpdateTerm={handleUpdateSelectedTerm}
            />
          </div>
        </div>
        {/* Projects Tabs */}
        <Tabs value={activeProjectId} onValueChange={setActiveProjectId} className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-muted">
              {projects.map((project) => (
                <TabsTrigger
                  key={project.id}
                  value={project.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {project.name}
                  {projects.length > 1 && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteProjectDialog({ open: true, projectId: project.id });
                      }}
                      className="ml-2 hover:text-destructive cursor-pointer inline-flex items-center"
                      role="button"
                      aria-label={t('deleteProject')}
                    >
                      <Trash2 className="h-3 w-3" />
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {!showNewProject && (
              <Button
                onClick={() => setShowNewProject(true)}
                variant="outline"
                size="sm"
                className="border-border"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('newProject')}
              </Button>
            )}
          </div>

          {showNewProject && (
            <div className="mb-6 p-4 bg-card rounded-lg border border-border shadow-card animate-scale-in">
              <div className="flex gap-2">
                <Input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddProject()}
                  placeholder="Projektname eingeben..."
                  className="flex-1 border-border"
                  autoFocus
                />
                <Button onClick={handleAddProject} className="bg-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('add')}
                </Button>
                <Button
                  onClick={() => {
                    setShowNewProject(false);
                    setNewProjectName("");
                  }}
                  variant="outline"
                >
                  {t('cancel')}
                </Button>
              </div>
            </div>
          )}

          {projects.map((project) => (
            <TabsContent key={project.id} value={project.id}>
              {/* Categories Section */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">{t('categories')}</h2>
                {!showNewCategory && (
                  <Button
                    onClick={() => setShowNewCategory(true)}
                    className="bg-gradient-primary text-white shadow-glow hover:shadow-lg transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('newCategory')}
                  </Button>
                )}
              </div>

              {showNewCategory && (
                <div className="mb-6 p-4 bg-card rounded-lg border border-border shadow-card animate-scale-in">
                  <div className="flex gap-2">
                    <Input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                      placeholder="Kategoriename eingeben..."
                      className="flex-1 border-border"
                      autoFocus
                    />
                    <Button onClick={handleAddCategory} className="bg-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Hinzufügen
                    </Button>
                    <Button
                      onClick={() => {
                        setShowNewCategory(false);
                        setNewCategoryName("");
                      }}
                      variant="outline"
                    >
                      Abbrechen
                    </Button>
                  </div>
                </div>
              )}

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEndCategory}
                  sensors={useSensors(
                    useSensor(PointerSensor, {
                      activationConstraint: {
                        distance: 8,
                      },
                    })
                  )}
                >
                  <SortableContext
                    items={project.categories.map((c) => c.id)}
                    strategy={rectSortingStrategy}
                  >
                    {project.categories.map((category) => (
                      <SortableCategoryCard
                        key={category.id}
                        category={category}
                        onDeleteCategory={handleDeleteCategory}
                        onOpenCategory={setOpenCategoryId}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>

              {project.categories.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">
                    Erstelle deine erste Kategorie in "{project.name}"!
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {openCategory && (
        <CategoryDetailDialog
          open={openCategoryId !== null}
          onOpenChange={(open) => !open && setOpenCategoryId(null)}
          category={openCategory}
          onAddTerm={handleAddTerm}
          onRemoveTerm={handleRemoveTermFromCategory}
          onSelectTerm={handleTermClick}
          selectedTerms={activePromptMode === "positive" ? selectedTerms : selectedNegativeTerms}
          // onAddSubcategory={handleAddSubcategory} // Removed
          // onDeleteSubcategory={handleDeleteSubcategory} // Removed
          // onAddTermToSubcategory={handleAddTermToSubcategory} // Removed
          // onRemoveTermFromSubcategory={handleRemoveTermFromSubcategory} // Removed
          onRenameCategory={handleRenameCategory}
          onEditTerm={handleEditTerm}
          onReorderTerms={handleReorderTerms}
        // onEditTermInSubcategory={handleEditTermInSubcategory} // Removed
        />
      )}

      <DeleteConfirmDialog
        open={deleteProjectDialog.open}
        onOpenChange={(open) => setDeleteProjectDialog({ open })}
        onConfirm={() => {
          if (deleteProjectDialog.projectId) {
            handleDeleteProject(deleteProjectDialog.projectId);
          }
          setDeleteProjectDialog({ open: false });
        }}
        title="Projekt löschen?"
        description={`Möchtest du das Projekt "${projects.find((p) => p.id === deleteProjectDialog.projectId)?.name
          }" wirklich löschen? Alle Kategorien und Begriffe gehen verloren.`}
      />

      <CommandPalette
        projects={projects}
        onSelectTerm={handleTermClick}
        onSelectCategory={(pid, cid) => {
          setActiveProjectId(pid);
          setOpenCategoryId(cid);
        }}
      />
    </div>
  );
};

export default Index;
