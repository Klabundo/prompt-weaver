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
      noTerms: "Keine Begriffe vorhanden",
      
      // Dialogs
      createCategory: "Kategorie erstellen",
      createSubcategory: "Unterkategorie erstellen",
      addTerm: "Begriff hinzufügen",
      deleteConfirm: "Löschen bestätigen",
      deleteWarning: "Möchten Sie dieses Element wirklich löschen?",
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
      noTerms: "No terms available",
      
      // Dialogs
      createCategory: "Create Category",
      createSubcategory: "Create Subcategory",
      addTerm: "Add Term",
      deleteConfirm: "Confirm Delete",
      deleteWarning: "Are you sure you want to delete this item?",
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
      noTerms: "No hay términos disponibles",
      
      // Dialogs
      createCategory: "Crear Categoría",
      createSubcategory: "Crear Subcategoría",
      addTerm: "Añadir Término",
      deleteConfirm: "Confirmar Eliminación",
      deleteWarning: "¿Estás seguro de que quieres eliminar este elemento?",
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
      noTerms: "Aucun terme disponible",
      
      // Dialogs
      createCategory: "Créer une Catégorie",
      createSubcategory: "Créer une Sous-catégorie",
      addTerm: "Ajouter un Terme",
      deleteConfirm: "Confirmer la Suppression",
      deleteWarning: "Êtes-vous sûr de vouloir supprimer cet élément ?",
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
