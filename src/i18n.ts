import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  de: {
    translation: {
      // Navigation
      projects: "Projekte",
      settings: "Einstellungen",
      
      // Categories
      category: "Kategorie",
      categories: "Kategorien",
      subcategory: "Unterkategorie",
      subcategories: "Unterkategorien",
      terms: "Begriffe",
      
      // Actions
      add: "Hinzufügen",
      delete: "Löschen",
      edit: "Bearbeiten",
      save: "Speichern",
      cancel: "Abbrechen",
      create: "Erstellen",
      back: "Zurück",
      
      // Placeholders & Labels
      termPlaceholder: "z.B. house, romantic...",
      imageUrl: "Bild URL",
      imageUpload: "Hochladen",
      imageUrlLabel: "Bild URL (optional)",
      imageUploadLabel: "Bild hochladen (optional)",
      imageSelected: "Bild ausgewählt",
      termRequired: "Begriff*",
      
      // Category specific
      withImage: "mit Bild",
      termCount: "Begriff",
      termCountPlural: "Begriffe",
      selected: "ausgewählt",
      
      // Drag and Drop
      dragToSubcategory: "In Unterkategorie ziehen",
      dropHere: "Hier ablegen",
      
      // Settings
      settingsTitle: "Einstellungen",
      appearance: "Darstellung",
      darkMode: "Dark Mode",
      language: "Sprache",
      dataManagement: "Datenverwaltung",
      autoSave: "Automatisches Speichern",
      exportData: "Daten exportieren",
      importData: "Daten importieren",
      clearAllData: "Alle Daten löschen",
      
      // Messages
      noProjects: "Keine Projekte vorhanden",
      noCategories: "Keine Kategorien vorhanden",
      noTerms: "Noch keine Begriffe vorhanden",
      createFirstCategory: "Erstelle deine erste Kategorie",
      projectAdded: "Projekt hinzugefügt!",
      projectDeleted: "Projekt gelöscht",
      categoryAdded: "Kategorie hinzugefügt!",
      categoryDeleted: "Kategorie gelöscht!",
      subcategoryAdded: "Unterkategorie hinzugefügt!",
      subcategoryDeleted: "Unterkategorie gelöscht!",
      termAdded: "Begriff hinzugefügt!",
      termAddedToSubcategory: "Begriff zur Unterkategorie hinzugefügt!",
      termRemoved: "Begriff entfernt",
      selectionCleared: "Auswahl zurückgesetzt",
      dataImported: "Daten erfolgreich importiert!",
      dataExportError: "Fehler beim Importieren der Daten",
      allDataCleared: "Alle Daten wurden gelöscht",
      
      // Dialogs
      createCategory: "Kategorie erstellen",
      createSubcategory: "Unterkategorie erstellen",
      addTerm: "Begriff hinzufügen",
      addTermDescription: "Füge einen neuen Begriff hinzu, optional mit Bild",
      deleteConfirm: "Löschen bestätigen",
      deleteWarning: "Möchten Sie dieses Element wirklich löschen?",
      deleteCategoryTitle: "Kategorie löschen?",
      deleteCategoryDescription: "Möchtest du die Kategorie wirklich löschen? Alle Begriffe gehen verloren.",
      deleteSubcategoryTitle: "Unterkategorie löschen?",
      deleteSubcategoryDescription: "Möchtest du die Unterkategorie wirklich löschen? Alle Begriffe gehen verloren.",
      deleteTermTitle: "Begriff löschen?",
      deleteTermDescription: "Möchtest du den Begriff wirklich löschen?",
      deleteProjectTitle: "Projekt löschen?",
      deleteProjectDescription: "Möchtest du das Projekt wirklich löschen? Alle Kategorien und Begriffe gehen verloren.",
      
      // Main page
      appTitle: "AI Prompt Builder",
      appSubtitle: "Erstelle perfekte Prompts für deine AI-Bilder",
      selectedTermsTitle: "Ausgewählte Begriffe",
      selectedTermsDescription: "Wähle Begriffe aus den Kategorien aus, um deinen Prompt zu erstellen...",
      copyPrompt: "Prompt kopieren",
      clearSelection: "Auswahl löschen",
      promptCopied: "Prompt kopiert!",
      newProject: "Neues Projekt",
      projectName: "Projekt-Name",
      newCategory: "Neue Kategorie",
      categoryName: "Kategorie-Name",
    }
  },
  en: {
    translation: {
      // Navigation
      projects: "Projects",
      settings: "Settings",
      
      // Categories
      category: "Category",
      categories: "Categories",
      subcategory: "Subcategory",
      subcategories: "Subcategories",
      terms: "Terms",
      
      // Actions
      add: "Add",
      delete: "Delete",
      edit: "Edit",
      save: "Save",
      cancel: "Cancel",
      create: "Create",
      back: "Back",
      
      // Placeholders & Labels
      termPlaceholder: "e.g. house, romantic...",
      imageUrl: "Image URL",
      imageUpload: "Upload",
      imageUrlLabel: "Image URL (optional)",
      imageUploadLabel: "Upload image (optional)",
      imageSelected: "Image selected",
      termRequired: "Term*",
      withImage: "with image",
      termCount: "term",
      termCountPlural: "terms",
      selected: "selected",
      
      // Drag and Drop
      dragToSubcategory: "Drag to subcategory",
      dropHere: "Drop here",
      
      // Settings
      settingsTitle: "Settings",
      appearance: "Appearance",
      darkMode: "Dark Mode",
      language: "Language",
      dataManagement: "Data Management",
      autoSave: "Auto Save",
      exportData: "Export Data",
      importData: "Import Data",
      clearAllData: "Clear All Data",
      
      // Messages
      noProjects: "No projects available",
      noCategories: "No categories available",
      noTerms: "No terms yet",
      createFirstCategory: "Create your first category",
      projectAdded: "Project added!",
      projectDeleted: "Project deleted",
      categoryAdded: "Category added!",
      categoryDeleted: "Category deleted!",
      subcategoryAdded: "Subcategory added!",
      subcategoryDeleted: "Subcategory deleted!",
      termAdded: "Term added!",
      termAddedToSubcategory: "Term added to subcategory!",
      termRemoved: "Term removed",
      selectionCleared: "Selection cleared",
      dataImported: "Data imported successfully!",
      dataExportError: "Error importing data",
      allDataCleared: "All data has been cleared",
      
      // Dialogs
      createCategory: "Create Category",
      createSubcategory: "Create Subcategory",
      addTerm: "Add Term",
      addTermDescription: "Add a new term, optionally with an image",
      deleteConfirm: "Confirm Delete",
      deleteWarning: "Are you sure you want to delete this item?",
      deleteCategoryTitle: "Delete category?",
      deleteCategoryDescription: "Do you really want to delete this category? All terms will be lost.",
      deleteSubcategoryTitle: "Delete subcategory?",
      deleteSubcategoryDescription: "Do you really want to delete this subcategory? All terms will be lost.",
      deleteTermTitle: "Delete term?",
      deleteTermDescription: "Do you really want to delete this term?",
      deleteProjectTitle: "Delete project?",
      deleteProjectDescription: "Do you really want to delete this project? All categories and terms will be lost.",
      
      // Main page
      appTitle: "AI Prompt Builder",
      appSubtitle: "Create perfect prompts for your AI images",
      selectedTermsTitle: "Selected Terms",
      selectedTermsDescription: "Select terms from categories to create your prompt...",
      copyPrompt: "Copy Prompt",
      clearSelection: "Clear Selection",
      promptCopied: "Prompt copied!",
      newProject: "New Project",
      projectName: "Project Name",
      newCategory: "New Category",
      categoryName: "Category Name",
    }
  },
  es: {
    translation: {
      // Navigation
      projects: "Proyectos",
      settings: "Configuración",
      
      // Categories
      category: "Categoría",
      categories: "Categorías",
      subcategory: "Subcategoría",
      subcategories: "Subcategorías",
      terms: "Términos",
      
      // Actions
      add: "Añadir",
      delete: "Eliminar",
      edit: "Editar",
      save: "Guardar",
      cancel: "Cancelar",
      create: "Crear",
      back: "Volver",
      
      // Placeholders & Labels
      termPlaceholder: "p.ej. casa, romántico...",
      imageUrl: "URL de imagen",
      imageUpload: "Subir",
      imageUrlLabel: "URL de imagen (opcional)",
      imageUploadLabel: "Subir imagen (opcional)",
      imageSelected: "Imagen seleccionada",
      termRequired: "Término*",
      withImage: "con imagen",
      termCount: "término",
      termCountPlural: "términos",
      selected: "seleccionado",
      
      // Drag and Drop
      dragToSubcategory: "Arrastrar a subcategoría",
      dropHere: "Soltar aquí",
      
      // Settings
      settingsTitle: "Configuración",
      appearance: "Apariencia",
      darkMode: "Modo Oscuro",
      language: "Idioma",
      dataManagement: "Gestión de Datos",
      autoSave: "Guardado Automático",
      exportData: "Exportar Datos",
      importData: "Importar Datos",
      clearAllData: "Borrar Todos los Datos",
      
      // Messages
      noProjects: "No hay proyectos disponibles",
      noCategories: "No hay categorías disponibles",
      noTerms: "Aún no hay términos",
      createFirstCategory: "Crea tu primera categoría",
      projectAdded: "¡Proyecto añadido!",
      projectDeleted: "Proyecto eliminado",
      categoryAdded: "¡Categoría añadida!",
      categoryDeleted: "¡Categoría eliminada!",
      subcategoryAdded: "¡Subcategoría añadida!",
      subcategoryDeleted: "¡Subcategoría eliminada!",
      termAdded: "¡Término añadido!",
      termAddedToSubcategory: "¡Término añadido a subcategoría!",
      termRemoved: "Término eliminado",
      selectionCleared: "Selección borrada",
      dataImported: "¡Datos importados exitosamente!",
      dataExportError: "Error al importar datos",
      allDataCleared: "Todos los datos han sido eliminados",
      
      // Dialogs
      createCategory: "Crear Categoría",
      createSubcategory: "Crear Subcategoría",
      addTerm: "Añadir Término",
      addTermDescription: "Añade un nuevo término, opcionalmente con una imagen",
      deleteConfirm: "Confirmar Eliminación",
      deleteWarning: "¿Estás seguro de que quieres eliminar este elemento?",
      deleteCategoryTitle: "¿Eliminar categoría?",
      deleteCategoryDescription: "¿Realmente quieres eliminar esta categoría? Todos los términos se perderán.",
      deleteSubcategoryTitle: "¿Eliminar subcategoría?",
      deleteSubcategoryDescription: "¿Realmente quieres eliminar esta subcategoría? Todos los términos se perderán.",
      deleteTermTitle: "¿Eliminar término?",
      deleteTermDescription: "¿Realmente quieres eliminar este término?",
      deleteProjectTitle: "¿Eliminar proyecto?",
      deleteProjectDescription: "¿Realmente quieres eliminar este proyecto? Todas las categorías y términos se perderán.",
      
      // Main page
      appTitle: "Generador de Prompts IA",
      appSubtitle: "Crea prompts perfectos para tus imágenes IA",
      selectedTermsTitle: "Términos Seleccionados",
      selectedTermsDescription: "Selecciona términos de las categorías para crear tu prompt...",
      copyPrompt: "Copiar Prompt",
      clearSelection: "Limpiar Selección",
      promptCopied: "¡Prompt copiado!",
      newProject: "Nuevo Proyecto",
      projectName: "Nombre del Proyecto",
      newCategory: "Nueva Categoría",
      categoryName: "Nombre de la Categoría",
    }
  },
  fr: {
    translation: {
      // Navigation
      projects: "Projets",
      settings: "Paramètres",
      
      // Categories
      category: "Catégorie",
      categories: "Catégories",
      subcategory: "Sous-catégorie",
      subcategories: "Sous-catégories",
      terms: "Termes",
      
      // Actions
      add: "Ajouter",
      delete: "Supprimer",
      edit: "Modifier",
      save: "Enregistrer",
      cancel: "Annuler",
      create: "Créer",
      back: "Retour",
      
      // Placeholders & Labels
      termPlaceholder: "p.ex. maison, romantique...",
      imageUrl: "URL de l'image",
      imageUpload: "Télécharger",
      imageUrlLabel: "URL de l'image (optionnel)",
      imageUploadLabel: "Télécharger l'image (optionnel)",
      imageSelected: "Image sélectionnée",
      termRequired: "Terme*",
      withImage: "avec image",
      termCount: "terme",
      termCountPlural: "termes",
      selected: "sélectionné",
      
      // Drag and Drop
      dragToSubcategory: "Glisser vers la sous-catégorie",
      dropHere: "Déposer ici",
      
      // Settings
      settingsTitle: "Paramètres",
      appearance: "Apparence",
      darkMode: "Mode Sombre",
      language: "Langue",
      dataManagement: "Gestion des Données",
      autoSave: "Sauvegarde Automatique",
      exportData: "Exporter les Données",
      importData: "Importer les Données",
      clearAllData: "Effacer Toutes les Données",
      
      // Messages
      noProjects: "Aucun projet disponible",
      noCategories: "Aucune catégorie disponible",
      noTerms: "Aucun terme encore",
      createFirstCategory: "Créez votre première catégorie",
      projectAdded: "Projet ajouté !",
      projectDeleted: "Projet supprimé",
      categoryAdded: "Catégorie ajoutée !",
      categoryDeleted: "Catégorie supprimée !",
      subcategoryAdded: "Sous-catégorie ajoutée !",
      subcategoryDeleted: "Sous-catégorie supprimée !",
      termAdded: "Terme ajouté !",
      termAddedToSubcategory: "Terme ajouté à la sous-catégorie !",
      termRemoved: "Terme supprimé",
      selectionCleared: "Sélection effacée",
      dataImported: "Données importées avec succès !",
      dataExportError: "Erreur lors de l'importation des données",
      allDataCleared: "Toutes les données ont été effacées",
      
      // Dialogs
      createCategory: "Créer une Catégorie",
      createSubcategory: "Créer une Sous-catégorie",
      addTerm: "Ajouter un Terme",
      addTermDescription: "Ajouter un nouveau terme, optionnellement avec une image",
      deleteConfirm: "Confirmer la Suppression",
      deleteWarning: "Êtes-vous sûr de vouloir supprimer cet élément ?",
      deleteCategoryTitle: "Supprimer la catégorie ?",
      deleteCategoryDescription: "Voulez-vous vraiment supprimer cette catégorie ? Tous les termes seront perdus.",
      deleteSubcategoryTitle: "Supprimer la sous-catégorie ?",
      deleteSubcategoryDescription: "Voulez-vous vraiment supprimer cette sous-catégorie ? Tous les termes seront perdus.",
      deleteTermTitle: "Supprimer le terme ?",
      deleteTermDescription: "Voulez-vous vraiment supprimer ce terme ?",
      deleteProjectTitle: "Supprimer le projet ?",
      deleteProjectDescription: "Voulez-vous vraiment supprimer ce projet ? Toutes les catégories et termes seront perdus.",
      
      // Main page
      appTitle: "Générateur de Prompts IA",
      appSubtitle: "Créez des prompts parfaits pour vos images IA",
      selectedTermsTitle: "Termes Sélectionnés",
      selectedTermsDescription: "Sélectionnez des termes dans les catégories pour créer votre prompt...",
      copyPrompt: "Copier le Prompt",
      clearSelection: "Effacer la Sélection",
      promptCopied: "Prompt copié !",
      newProject: "Nouveau Projet",
      projectName: "Nom du Projet",
      newCategory: "Nouvelle Catégorie",
      categoryName: "Nom de la Catégorie",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'de',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
