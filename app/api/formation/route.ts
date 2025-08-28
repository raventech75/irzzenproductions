// app/api/formation/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface FormationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  age: string;
  currentLevel: string;
  experience: string;
  expectations: string;
  availability: string;
  equipment: string;
}

function validateFormationData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.firstName?.trim()) errors.push('Le prénom est requis');
  if (!data.lastName?.trim()) errors.push('Le nom est requis');
  if (!data.email?.trim()) errors.push('L\'email est requis');
  if (!data.currentLevel?.trim()) errors.push('Le niveau actuel est requis');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email.trim())) {
    errors.push('Format d\'email invalide');
  }

  if (data.age && (isNaN(data.age) || data.age < 16 || data.age > 99)) {
    errors.push('L\'âge doit être entre 16 et 99 ans');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function getLevelLabel(level: string): string {
  const levels = {
    'debutant': 'Débutant (jamais fait de montage)',
    'initie': 'Initié (quelques notions de base)',
    'intermediate': 'Intermédiaire (montage simple)',
    'avance': 'Avancé (souhaite se spécialiser)'
  };
  return levels[level as keyof typeof levels] || level;
}

async function sendToFormspree(formationData: FormationData) {
  if (!process.env.FORMSPREE_FORM_ID) {
    throw new Error('FORMSPREE_FORM_ID non configuré dans les variables d\'environnement');
  }

  const formspreeData = {
    // Utilisez des noms de champs lisibles pour l'email
    "Prénom": formationData.firstName,
    "Nom": formationData.lastName,
    "Email": formationData.email,
    "Téléphone": formationData.phone || "Non renseigné",
    "Adresse": formationData.address || "Non renseignée",
    "Code postal": formationData.postalCode || "Non renseigné",
    "Ville": formationData.city || "Non renseignée",
    "Pays": formationData.country || "Non renseigné",
    "Âge": formationData.age || "Non renseigné",
    "Niveau actuel": getLevelLabel(formationData.currentLevel),
    "Équipement": formationData.equipment || "Non renseigné",
    "Expérience": formationData.experience || "Aucune expérience mentionnée",
    "Attentes": formationData.expectations || "Aucune attente spécifique",
    "Disponibilités": formationData.availability || "Non renseignées",
    "Type": "Demande de formation montage vidéo",
    "Date de soumission": new Date().toLocaleString('fr-FR'),
    "_subject": `Nouvelle demande de formation - ${formationData.firstName} ${formationData.lastName}`,
    "_replyto": formationData.email
  };

  const response = await fetch(`https://formspree.io/f/${process.env.FORMSPREE_FORM_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formspreeData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur Formspree: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    // Vérification du Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type doit être application/json' },
        { status: 400 }
      );
    }

    const data = await request.json();

    // Validation des données
    const validation = validateFormationData(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Données invalides', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    const formationData: FormationData = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || '',
      address: data.address?.trim() || '',
      postalCode: data.postalCode?.trim() || '',
      city: data.city?.trim() || '',
      country: data.country?.trim() || '',
      age: data.age?.trim() || '',
      currentLevel: data.currentLevel.trim(),
      experience: data.experience?.trim() || '',
      expectations: data.expectations?.trim() || '',
      availability: data.availability?.trim() || '',
      equipment: data.equipment?.trim() || '',
    };

    // Envoi vers Formspree
    await sendToFormspree(formationData);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Demande de formation reçue avec succès',
        data: {
          email: formationData.email,
          status: 'sent'
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erreur API formation:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors du traitement de la demande',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}