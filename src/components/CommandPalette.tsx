import { useEffect, useState } from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Term {
    text: string;
    image?: string;
}

interface Category {
    id: string;
    name: string;
    terms: Term[];
}

interface Project {
    id: string;
    name: string;
    categories: Category[];
}

interface CommandPaletteProps {
    projects: Project[];
    onSelectTerm: (term: string) => void;
    onSelectCategory: (projectId: string, categoryId: string) => void;
}

export const CommandPalette = ({ projects, onSelectTerm, onSelectCategory }: CommandPaletteProps) => {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <>
            <div
                className="fixed bottom-4 right-4 z-50 md:hidden"
                onClick={() => setOpen(true)}
            >
                <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
                    <Search className="h-6 w-6" />
                </div>
            </div>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search terms and categories..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    {projects.map((project) => (
                        <div key={project.id}>
                            {project.categories.length > 0 && (
                                <CommandGroup heading={project.name}>
                                    {project.categories.map((category) => (
                                        <div key={category.id}>
                                            <CommandItem
                                                value={`C: ${category.name} ${project.name}`}
                                                onSelect={() => {
                                                    onSelectCategory(project.id, category.id);
                                                    setOpen(false);
                                                }}
                                            >
                                                <Search className="mr-2 h-4 w-4" />
                                                <span>{category.name}</span>
                                                <Badge variant="outline" className="ml-2 text-xs">Category</Badge>
                                            </CommandItem>

                                            {category.terms.map((term) => (
                                                <CommandItem
                                                    key={`${category.id}-${term.text}`}
                                                    value={`${term.text} ${category.name}`}
                                                    onSelect={() => {
                                                        onSelectTerm(term.text);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <span className="ml-6">{term.text}</span>
                                                </CommandItem>
                                            ))}
                                        </div>
                                    ))}
                                </CommandGroup>
                            )}
                            <CommandSeparator />
                        </div>
                    ))}
                </CommandList>
            </CommandDialog>
        </>
    );
};
