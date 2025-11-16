import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryCard } from "@/components/CategoryCard";
import { PromptPreview } from "@/components/PromptPreview";
import { Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  terms: string[];
}

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Objekt",
      terms: ["house", "car", "tree", "mountain"],
    },
    {
      id: "2",
      name: "Farben",
      terms: ["yellow roof", "blue sky", "green grass"],
    },
    {
      id: "3",
      name: "Stimmung",
      terms: ["romantic", "dramatic", "peaceful", "mysterious"],
    },
  ]);

  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        terms: [],
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setShowNewCategory(false);
      toast.success("Kategorie hinzugefügt!");
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId));
    toast.success("Kategorie gelöscht");
  };

  const handleAddTerm = (categoryId: string, term: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, terms: [...cat.terms, term] } : cat
      )
    );
    toast.success("Begriff hinzugefügt!");
  };

  const handleRemoveTerm = (categoryId: string, term: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, terms: cat.terms.filter((t) => t !== term) }
          : cat
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Prompt Builder
            </h1>
          </div>
          <p className="text-center text-muted-foreground mt-2">
            Erstelle perfekte Prompts für deine AI-Bilder
          </p>
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
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onAddTerm={handleAddTerm}
              onRemoveTerm={handleRemoveTerm}
              onDeleteCategory={handleDeleteCategory}
              onSelectTerm={handleSelectTerm}
              selectedTerms={selectedTerms}
            />
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">
              Erstelle deine erste Kategorie, um zu starten!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
