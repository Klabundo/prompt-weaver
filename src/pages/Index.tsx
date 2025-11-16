import { useState } from "react";
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
  subcategories?: Subcategory[];
}

interface Project {
  id: string;
  name: string;
  categories: Category[];
}

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([
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
  ]);

  const [activeProjectId, setActiveProjectId] = useState(projects[0].id);
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
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
      toast.success("Projekt hinzugefügt!");
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId));
    if (activeProjectId === projectId && projects.length > 1) {
      setActiveProjectId(projects.find((p) => p.id !== projectId)!.id);
    }
    toast.success("Projekt gelöscht");
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() && activeProject) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        terms: [],
        subcategories: [],
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
      toast.success("Kategorie hinzugefügt!");
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
    toast.success("Kategorie gelöscht");
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
    toast.success("Begriff hinzugefügt!");
  };

  const handleRemoveTerm = (categoryId: string, term: string) => {
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
    setSelectedTerms(selectedTerms.filter((t) => t !== term));
  };

  const handleAddSubcategory = (categoryId: string, name: string) => {
    setProjects(
      projects.map((p) =>
        p.id === activeProjectId
          ? {
              ...p,
              categories: p.categories.map((cat) =>
                cat.id === categoryId
                  ? {
                      ...cat,
                      subcategories: [
                        ...(cat.subcategories || []),
                        { id: Date.now().toString(), name, terms: [] },
                      ],
                    }
                  : cat
              ),
            }
          : p
      )
    );
    toast.success("Unterkategorie hinzugefügt!");
  };

  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
    setProjects(
      projects.map((p) =>
        p.id === activeProjectId
          ? {
              ...p,
              categories: p.categories.map((cat) =>
                cat.id === categoryId
                  ? {
                      ...cat,
                      subcategories: (cat.subcategories || []).filter(
                        (sub) => sub.id !== subcategoryId
                      ),
                    }
                  : cat
              ),
            }
          : p
      )
    );
    toast.success("Unterkategorie gelöscht");
  };

  const handleAddTermToSubcategory = (
    categoryId: string,
    subcategoryId: string,
    term: string,
    image?: string
  ) => {
    setProjects(
      projects.map((p) =>
        p.id === activeProjectId
          ? {
              ...p,
              categories: p.categories.map((cat) =>
                cat.id === categoryId
                  ? {
                      ...cat,
                      subcategories: (cat.subcategories || []).map((sub) =>
                        sub.id === subcategoryId
                          ? { ...sub, terms: [...sub.terms, { text: term, image }] }
                          : sub
                      ),
                    }
                  : cat
              ),
            }
          : p
      )
    );
    toast.success("Begriff zur Unterkategorie hinzugefügt!");
  };

  const handleRemoveTermFromSubcategory = (
    categoryId: string,
    subcategoryId: string,
    term: string
  ) => {
    setProjects(
      projects.map((p) =>
        p.id === activeProjectId
          ? {
              ...p,
              categories: p.categories.map((cat) =>
                cat.id === categoryId
                  ? {
                      ...cat,
                      subcategories: (cat.subcategories || []).map((sub) =>
                        sub.id === subcategoryId
                          ? { ...sub, terms: sub.terms.filter((t) => t.text !== term) }
                          : sub
                      ),
                    }
                  : cat
              ),
            }
          : p
      )
    );
    setSelectedTerms(selectedTerms.filter((t) => t !== term));
  };

  const handleSelectTerm = (term: string) => {
    if (selectedTerms.includes(term)) {
      setSelectedTerms(selectedTerms.filter((t) => t !== term));
    } else {
      setSelectedTerms([...selectedTerms, term]);
    }
  };

  const handleClearSelection = () => {
    setSelectedTerms([]);
    toast.success("Auswahl zurückgesetzt");
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
            toast.success("Daten erfolgreich importiert!");
          } catch (error) {
            toast.error("Fehler beim Importieren der Daten");
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
    toast.success("Alle Daten wurden gelöscht");
  };

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
                  AI Prompt Builder
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Erstelle perfekte Prompts für deine AI-Bilder
                </p>
              </div>
            </div>
            <SettingsDialog 
              onExport={handleExportData}
              onImport={handleImportData}
              onClearData={handleClearAllData}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Prompt Preview */}
        <div className="mb-8 animate-fade-in">
          <PromptPreview
            selectedTerms={selectedTerms}
            onClear={handleClearSelection}
          />
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteProjectDialog({ open: true, projectId: project.id });
                      }}
                      className="ml-2 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
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
                Neues Projekt
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
                  Hinzufügen
                </Button>
                <Button
                  onClick={() => {
                    setShowNewProject(false);
                    setNewProjectName("");
                  }}
                  variant="outline"
                >
                  Abbrechen
                </Button>
              </div>
            </div>
          )}

          {projects.map((project) => (
            <TabsContent key={project.id} value={project.id}>
              {/* Categories Section */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Kategorien</h2>
                {!showNewCategory && (
                  <Button
                    onClick={() => setShowNewCategory(true)}
                    className="bg-gradient-primary text-white shadow-glow hover:shadow-lg transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Neue Kategorie
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
                {project.categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onDeleteCategory={handleDeleteCategory}
                    onOpenCategory={setOpenCategoryId}
                  />
                ))}
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
          onRemoveTerm={handleRemoveTerm}
          onSelectTerm={handleSelectTerm}
          selectedTerms={selectedTerms}
          onAddSubcategory={handleAddSubcategory}
          onDeleteSubcategory={handleDeleteSubcategory}
          onAddTermToSubcategory={handleAddTermToSubcategory}
          onRemoveTermFromSubcategory={handleRemoveTermFromSubcategory}
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
        description={`Möchtest du das Projekt "${
          projects.find((p) => p.id === deleteProjectDialog.projectId)?.name
        }" wirklich löschen? Alle Kategorien und Begriffe gehen verloren.`}
      />
    </div>
  );
};

export default Index;
