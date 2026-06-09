export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          user_id: string;
          prenom_marie1: string;
          prenom_marie2: string;
          date_mariage: string;
          lieu: string | null;
          formule: string;
          statut: "prospect" | "confirme" | "en_cours" | "livre" | "termine";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["clients"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>;
      };
      galeries: {
        Row: {
          id: string;
          client_id: string;
          nom: string;
          type: "photo" | "video";
          nb_fichiers: number;
          taille_totale: number;
          actif: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["galeries"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["galeries"]["Insert"]>;
      };
      fichiers: {
        Row: {
          id: string;
          galerie_id: string;
          nom: string;
          url: string;
          url_miniature: string | null;
          type: "photo" | "video";
          taille: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["fichiers"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["fichiers"]["Insert"]>;
      };
      contrats: {
        Row: {
          id: string;
          client_id: string;
          titre: string;
          statut: "en_attente" | "signe" | "expire";
          signe_le: string | null;
          pdf_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["contrats"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["contrats"]["Insert"]>;
      };
    };
  };
};
