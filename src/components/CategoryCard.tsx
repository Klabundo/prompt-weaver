import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Trash2 } from "lucide-react";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    terms: string[];
  };
  onAddTerm: (categoryId: string, term: string) => void;
  onRemoveTerm: (categoryId: string, term: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onSelectTerm: (term: string) => void;
  selectedTerms: string[];
}

export const CategoryCard = ({
  category,
  onAddTerm,
  onRemoveTerm,
  onDeleteCategory,
  onSelectTerm,
  selectedTerms,
}: CategoryCardProps) => {
  const [newTerm, setNewTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTerm = () => {
    if (newTerm.trim()) {
      onAddTerm(category.id, newTerm.trim());
      setNewTerm("");
      setIsAdding(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300 animate-scale-in border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteCategory(category.id)}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 min-h-[2.5rem]">
        {category.terms.map((term) => (
          <Badge
            key={term}
            variant={selectedTerms.includes(term) ? "default" : "secondary"}
            className={`cursor-pointer transition-all duration-200 ${
              selectedTerms.includes(term)
                ? "bg-primary text-primary-foreground shadow-glow scale-105"
                : "hover:bg-secondary/80"
            }`}
            onClick={() => onSelectTerm(term)}
          >
            {term}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveTerm(category.id, term);
              }}
              className="ml-1.5 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {isAdding ? (
        <div className="flex gap-2 animate-fade-in">
          <Input
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTerm()}
            placeholder="Begriff eingeben..."
            className="flex-1 border-border bg-background"
            autoFocus
          />
          <Button onClick={handleAddTerm} size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => {
              setIsAdding(false);
              setNewTerm("");
            }}
            variant="ghost"
            size="sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          size="sm"
          className="w-full border-dashed border-border hover:border-primary hover:bg-secondary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Begriff hinzufügen
        </Button>
      )}
    </Card>
  );
};
