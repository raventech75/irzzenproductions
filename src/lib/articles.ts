export type Article = {
  slug: string;
  titre: string;
  metaDescription: string;
  extrait: string;
  categorie: string;
  date: string;
  dateISO: string;
  lecture: string;
  image: string;
  imageAlt: string;
  contenu: Section[];
};

export type Section = {
  type: "intro" | "h2" | "h3" | "p" | "ul" | "ol" | "quote" | "image" | "cta";
  contenu?: string;
  items?: string[];
  src?: string;
  alt?: string;
  legende?: string;
  lien?: string;
  bouton?: string;
};

export const articles: Article[] = [
  {
    slug: "comment-choisir-photographe-mariage",
    titre: "Comment choisir son photographe de mariage : 7 critères essentiels",
    metaDescription:
      "Comment choisir le bon photographe de mariage ? Découvrez les 7 critères indispensables pour ne pas se tromper et avoir des photos inoubliables.",
    extrait:
      "Le choix du photographe est l'une des décisions les plus importantes de votre mariage. Voici les critères qui font la différence entre un souvenir ordinaire et des images qui traversent le temps.",
    categorie: "Conseils",
    date: "15 novembre 2024",
    dateISO: "2024-11-15",
    lecture: "6 min",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80",
    imageAlt: "Photographe de mariage en action",
    contenu: [
      {
        type: "intro",
        contenu:
          "Votre photographe de mariage sera la seule personne présente toute la journée, capable de capturer chaque instant précieux. Un mauvais choix et ce sont des souvenirs à jamais perdus. Un bon choix et ce sont des images qui feront pleurer vos petits-enfants d'émotion. Voici les 7 critères que nous, après 15 ans dans le métier, considérons comme absolument essentiels.",
      },
      {
        type: "h2",
        contenu: "1. Le style photographique avant tout",
      },
      {
        type: "p",
        contenu:
          "Chaque photographe a une signature artistique. Certains privilégient le style reportage — discret, naturel, photojournalistique. D'autres préfèrent les poses élaborées, les compositions très travaillées. D'autres encore cherchent l'esthétique film argentique avec des tons délavés et chaleureux.",
      },
      {
        type: "p",
        contenu:
          "La première question à vous poser : quel style vous ressemble ? Feuilletez des magazines de mariage, parcourez Instagram, sauvegardez les images qui vous touchent. Vous verrez très vite une cohérence se dégager — c'est votre style.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&q=80",
        alt: "Couple lors d'une séance photo de mariage",
        legende: "Le style reportage capture les émotions brutes sans mise en scène",
      },
      {
        type: "h2",
        contenu: "2. La cohérence du portfolio",
      },
      {
        type: "p",
        contenu:
          "Méfiez-vous des photographes qui montrent 20 photos exceptionnelles issues de 20 mariages différents. Ce n'est pas représentatif. Ce qui compte, c'est la cohérence sur l'ensemble d'un reportage complet — les 400 photos d'un seul mariage.",
      },
      {
        type: "p",
        contenu:
          "Demandez à voir une galerie complète de A à Z : préparatifs, cérémonie, cocktail, soirée. Les 20 meilleures photos d'un reportage ne donnent aucune indication sur la qualité des 380 autres.",
      },
      {
        type: "ul",
        items: [
          "Demandez un reportage complet d'un mariage similaire au vôtre",
          "Vérifiez la qualité dans toutes les conditions lumineuses (intérieur, nuit, soleil dur)",
          "Observez comment les émotions spontanées sont capturées",
          "Regardez si les photos racontent une histoire cohérente",
        ],
      },
      {
        type: "h2",
        contenu: "3. L'expérience terrain et la gestion du stress",
      },
      {
        type: "p",
        contenu:
          "Un mariage, c'est une journée sous pression permanente. Retards, météo capricieuse, oncle envahissant, lumière inexistante en salle… Un photographe expérimenté a déjà tout vécu et sait s'adapter sans jamais le montrer.",
      },
      {
        type: "quote",
        contenu:
          "« Après 1 500 mariages, je peux vous dire qu'aucune journée ne se passe comme prévu. Ce qui fait la différence, c'est l'expérience accumulée pour trouver des solutions en quelques secondes. »",
      },
      {
        type: "p",
        contenu:
          "Posez des questions concrètes lors de votre premier rendez-vous : que se passe-t-il si votre appareil tombe en panne ? Comment gérez-vous une cérémonie en plein soleil de midi ? Avez-vous un backup de tout votre matériel ?",
      },
      {
        type: "h2",
        contenu: "4. Le feeling humain",
      },
      {
        type: "p",
        contenu:
          "Votre photographe passera 8 à 12 heures avec vous le jour J. Il sera dans votre chambre pendant les préparatifs, à vos côtés pendant la cérémonie, présent à tous les moments intimes. Si son énergie ne vous correspond pas, cela se ressentira sur les photos.",
      },
      {
        type: "p",
        contenu:
          "Rencontrez-le en personne ou en visio avant de signer. Posez-vous ces questions : est-il à l'écoute ? Se montre-t-il enthousiaste pour votre projet spécifique ou récite-t-il un discours commercial ? Vous met-il à l'aise ?",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&q=80",
        alt: "Cérémonie de mariage en plein air",
        legende: "La complicité avec votre photographe se voit sur chaque image",
      },
      {
        type: "h2",
        contenu: "5. Les clauses du contrat",
      },
      {
        type: "p",
        contenu:
          "Un photographe professionnel travaille obligatoirement avec un contrat détaillé. Vérifiez systématiquement ces points :",
      },
      {
        type: "ul",
        items: [
          "Nombre minimum de photos livrées garanti par écrit",
          "Délai de livraison précis (et pénalités si non respecté)",
          "Droits d'utilisation des photos (vous appartiennent-elles ?)",
          "Que se passe-t-il en cas d'empêchement du photographe ?",
          "Conditions d'annulation et de remboursement de l'acompte",
          "Format de livraison (galerie en ligne, USB, impression)",
        ],
      },
      {
        type: "h2",
        contenu: "6. Le rapport qualité-prix réel",
      },
      {
        type: "p",
        contenu:
          "Un photographe de mariage facture entre 800€ et 5 000€+. La fourchette est large et les prix ne reflètent pas toujours la qualité. Ce qui justifie un tarif élevé : l'expérience terrain, la qualité du matériel (et son backup), le temps de retouche, le service client avant et après.",
      },
      {
        type: "p",
        contenu:
          "Méfiez-vous des prix anormalement bas. Un photographe qui facture 400€ pour une journée complète ne peut pas économiquement livrer un travail de qualité — le temps de retouche seul représente plusieurs jours de travail.",
      },
      {
        type: "h2",
        contenu: "7. Les avis et recommandations",
      },
      {
        type: "p",
        contenu:
          "Les avis Google et les recommandations de proches restent les indicateurs les plus fiables. Cherchez des témoignages qui parlent non seulement des photos, mais aussi de l'expérience humaine le jour J et du service après livraison.",
      },
      {
        type: "ul",
        items: [
          "Demandez des références de couples ayant eu un mariage similaire au vôtre",
          "Lisez les avis en détail — les vrais clients mentionnent des détails précis",
          "Méfiez-vous des portfolios sans aucun avis visible",
        ],
      },
      {
        type: "cta",
        contenu: "Vous cherchez un photographe et vidéaste mariage premium ?",
        lien: "/tarifs",
        bouton: "Voir nos formules",
      },
    ],
  },
  {
    slug: "tendances-photo-mariage-2025",
    titre: "Tendances photographie mariage 2025 : ce qui va marquer les albums",
    metaDescription:
      "Découvrez les grandes tendances photo mariage 2025 : film argentique, golden hour, formats immersifs. Inspirez-vous pour votre reportage.",
    extrait:
      "Film argentique, lumières dorées, formats carrés… Découvrez les grandes tendances qui vont définir l'esthétique des mariages en 2025.",
    categorie: "Tendances",
    date: "3 octobre 2024",
    dateISO: "2024-10-03",
    lecture: "4 min",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80",
    imageAlt: "Photo de mariage tendance 2025",
    contenu: [
      {
        type: "intro",
        contenu:
          "La photographie de mariage évolue chaque année. 2025 marque une rupture avec les années précédentes : fini le tout-numérique lisse et sur-retouché, place à l'authenticité, la texture et l'émotion brute. Voici ce qui va dominer les albums cette année.",
      },
      {
        type: "h2",
        contenu: "Le grand retour du film argentique",
      },
      {
        type: "p",
        contenu:
          "Le film argentique n'a jamais vraiment disparu chez les photographes les plus créatifs, mais en 2025 il envahit le marché grand public. Les couples réclament ces tons chauds, ce grain subtil, ces légères surexpositions qui donnent aux photos un aspect intemporel immédiat.",
      },
      {
        type: "p",
        contenu:
          "Certains photographes shootent l'intégralité du mariage sur film (Kodak Portra 400, Fuji 400H). D'autres mixent numérique et argentique — numérique pour la sécurité, argentique pour les moments clés. Une tendance qui a un coût mais un rendu absolument unique.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1000&q=80",
        alt: "Photo de mariage au style argentique",
        legende: "Le grain argentique donne une dimension atemporelle aux images",
      },
      {
        type: "h2",
        contenu: "La golden hour érigée en religion",
      },
      {
        type: "p",
        contenu:
          "La golden hour — ces 30 à 60 minutes après le coucher du soleil — est désormais intégrée dans tous les programmes de mariage ambitieux. La lumière rasante, chaude et dorée transforme n'importe quel décor en tableau. Les photographes la planifient avec une précision d'ingénieur.",
      },
      {
        type: "ul",
        items: [
          "Prévoyez 30 minutes en couple avec votre photographe au coucher du soleil",
          "Choisissez un lieu de réception avec un horizon dégagé à l'Ouest",
          "La golden hour en été se situe autour de 21h — à intégrer dans votre timing",
        ],
      },
      {
        type: "h2",
        contenu: "Le format carré fait son grand retour",
      },
      {
        type: "p",
        contenu:
          "Popularisé par Instagram puis délaissé, le format carré revient en force — mais pour de vraies raisons artistiques cette fois. Le cadre 1:1 force à une composition plus épurée, plus centrée, plus graphique. Plusieurs photographes proposent désormais une sélection de leurs meilleures images en format carré, en complément du format classique.",
      },
      {
        type: "h2",
        contenu: "Les portraits en noir et blanc dramatiques",
      },
      {
        type: "p",
        contenu:
          "Le noir et blanc n'est pas nouveau, mais son traitement évolue. En 2025, on quitte le noir et blanc doux et nostalgique pour des contrastes forts, des noirs profonds, une dramaturgie assumée. Ces images ont un impact immédiat et vieillissent parfaitement.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&q=80",
        alt: "Portrait de mariés en noir et blanc",
        legende: "Le noir et blanc dramatique donne une puissance émotionnelle incomparable",
      },
      {
        type: "h2",
        contenu: "L'architecture et les grands espaces comme décors",
      },
      {
        type: "p",
        contenu:
          "Les couples cherchent des lieux qui racontent une histoire — châteaux, mas provençaux, lofts industriels, plages désertes. La tendance est aux décors qui parlent d'eux-mêmes, où le photographe n'a plus qu'à placer le couple au bon endroit au bon moment.",
      },
      {
        type: "h2",
        contenu: "La vidéo verticale pour les réseaux",
      },
      {
        type: "p",
        contenu:
          "En 2025, presque tous les couples demandent un ou plusieurs formats verticaux (9:16) pour partager sur Instagram Stories, TikTok et Reels. Les vidéastes mariage intègrent désormais systématiquement des plans conçus spécifiquement pour ce format dans leur tournage.",
      },
      {
        type: "cta",
        contenu: "Envie d'un reportage qui suit les dernières tendances ?",
        lien: "/contact",
        bouton: "Discutons de votre projet",
      },
    ],
  },
  {
    slug: "preparer-reportage-photo-mariage",
    titre: "Préparer son reportage photo mariage : le guide complet",
    metaDescription:
      "Comment préparer son reportage photo mariage ? Timeline, liste de photos, séance couple, conseils tenue… Le guide complet par des experts.",
    extrait:
      "Timeline, liste de photos, séance couple… Tout ce que vous devez savoir pour préparer au mieux votre reportage photo et obtenir les plus belles images.",
    categorie: "Guides",
    date: "22 septembre 2024",
    dateISO: "2024-09-22",
    lecture: "8 min",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=80",
    imageAlt: "Préparatifs de mariage",
    contenu: [
      {
        type: "intro",
        contenu:
          "Un reportage photo exceptionnel ne se fait pas uniquement le jour J — il se prépare des semaines à l'avance. Voici notre guide complet, fruit de 15 ans d'expérience et de 1 500+ mariages, pour que chaque moment soit parfaitement capturé.",
      },
      {
        type: "h2",
        contenu: "La timeline : votre meilleure alliée",
      },
      {
        type: "p",
        contenu:
          "Une bonne timeline est la base de tout reportage réussi. Elle permet au photographe d'anticiper, de se positionner, d'être là où il faut au bon moment. Transmettez-la à votre photographe au moins 2 semaines avant.",
      },
      {
        type: "ul",
        items: [
          "Préparatifs mariée : minimum 2h (coiffure, maquillage, robe)",
          "Préparatifs marié : 45 min à 1h",
          "Cérémonie civile : 30 à 45 min",
          "Cérémonie religieuse ou laïque : 1h à 1h30",
          "Séance couple : 30 à 45 min",
          "Cocktail : 1h30 à 2h",
          "Repas et soirée : selon votre programme",
        ],
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1000&q=80",
        alt: "Mariée en préparation",
        legende: "Les préparatifs offrent des moments de tendresse et d'intimité uniques",
      },
      {
        type: "h2",
        contenu: "La liste de photos : oui, mais avec mesure",
      },
      {
        type: "p",
        contenu:
          "Une liste de photos est utile pour les portraits de famille — elle garantit qu'on n'oublie personne. En revanche, une liste trop exhaustive pour tout le reste de la journée bride la créativité du photographe et transforme le reportage en séance de poses.",
      },
      {
        type: "p",
        contenu:
          "Notre recommandation : une liste stricte uniquement pour les portraits de groupe (20-30 photos maximum), et carte blanche pour le reste. C'est dans ces moments non scriptés que naissent les images les plus fortes.",
      },
      {
        type: "quote",
        contenu:
          "« Les photos dont nos mariés sont le plus fiers 10 ans après ne sont jamais celles qui étaient sur la liste. Ce sont les moments volés, les regards inattendus, les larmes qu'on n'avait pas prévu. »",
      },
      {
        type: "h2",
        contenu: "Optimiser les préparatifs",
      },
      {
        type: "p",
        contenu:
          "Les préparatifs sont souvent les photos préférées des mariées — l'émotion est à son comble, les détails sont beaux, la lumière du matin est magique. Pour les optimiser :",
      },
      {
        type: "ul",
        items: [
          "Choisissez un lieu avec beaucoup de lumière naturelle (fenêtres, baies vitrées)",
          "Gardez la pièce rangée — le photographe travaille dans l'espace disponible",
          "Préparez vos détails ensemble : alliance, chaussures, parfum, invitation",
          "Ne mettez pas votre robe avant l'arrivée du photographe",
          "Limitez le nombre de personnes présentes (moins d'agitation = meilleures photos)",
        ],
      },
      {
        type: "h2",
        contenu: "La séance couple : le moment à ne pas négliger",
      },
      {
        type: "p",
        contenu:
          "30 à 45 minutes seuls avec votre photographe, c'est ce qui permet d'obtenir les portraits de couple que vous afficherez en grand chez vous. Beaucoup de couples hésitent à « voler » du temps à leurs invités — c'est une erreur.",
      },
      {
        type: "p",
        contenu:
          "Profitez du cocktail pour vous éclipser. Vos invités seront occupés à se retrouver, à trinquer, à profiter des amuse-bouches — ils ne remarqueront même pas votre absence. Et vous reviendrez avec des images inoubliables.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=1000&q=80",
        alt: "Séance couple lors d'un mariage",
        legende: "La séance couple pendant le cocktail : 30 minutes qui valent une vie",
      },
      {
        type: "h2",
        contenu: "Les tenues : ce qui photographie bien",
      },
      {
        type: "p",
        contenu:
          "Certains matières et couleurs se comportent beaucoup mieux en photo que d'autres. Quelques règles :",
      },
      {
        type: "ul",
        items: [
          "La soie, la dentelle et le satin captent magnifiquement la lumière",
          "Évitez les motifs très chargés qui perturbent l'œil",
          "Le blanc pur peut surexposer par forte lumière — l'ivoire est plus photographique",
          "Prévoyez une tenue ou des chaussures de rechange pour la soirée",
        ],
      },
      {
        type: "h2",
        contenu: "Briefer vos proches",
      },
      {
        type: "p",
        contenu:
          "Demandez à vos proches de ranger leurs téléphones pendant la cérémonie, au moins pour les moments clés. Un océan d'écrans levés gâche les photos et distrait les mariés. Cette tendance du « unplugged wedding » gagne du terrain et pour de bonnes raisons.",
      },
      {
        type: "cta",
        contenu: "Prêts à construire ensemble le reportage parfait ?",
        lien: "/contact",
        bouton: "Vérifier nos disponibilités",
      },
    ],
  },
  {
    slug: "film-mariage-cinematographique-vs-reportage",
    titre: "Film cinématographique vs reportage vidéo : lequel choisir ?",
    metaDescription:
      "Film de mariage cinématographique ou reportage vidéo classique ? Différences, avantages, prix — on vous aide à choisir le bon format.",
    extrait:
      "Deux approches radicalement différentes pour immortaliser votre mariage en vidéo. On vous explique tout pour faire le bon choix.",
    categorie: "Conseils",
    date: "10 août 2024",
    dateISO: "2024-08-10",
    lecture: "5 min",
    image: "https://images.unsplash.com/photo-1556103255-4443dbae8e5a?w=1200&q=80",
    imageAlt: "Vidéaste mariage en train de filmer",
    contenu: [
      {
        type: "intro",
        contenu:
          "Quand il s'agit de vidéo de mariage, deux univers coexistent : le reportage vidéo traditionnel et le film cinématographique. L'un documente, l'autre raconte. L'un montre tout, l'autre choisit. Voici comment choisir en fonction de ce que vous attendez vraiment.",
      },
      {
        type: "h2",
        contenu: "Le reportage vidéo classique",
      },
      {
        type: "p",
        contenu:
          "Le reportage vidéo traditionnel vise à documenter votre journée de manière exhaustive. Préparatifs, cérémonie intégrale, discours complets, piste de danse… tout y est. La durée peut varier de 45 minutes à plusieurs heures.",
      },
      {
        type: "ul",
        items: [
          "✅ Vous revivez la journée dans son intégralité",
          "✅ Tous les discours et moments sont conservés",
          "✅ Moins cher (moins de temps de montage)",
          "❌ Difficile à regarder en entier après quelques années",
          "❌ Peu de travail sur l'émotion et l'esthétique",
          "❌ Son souvent capturé tel quel, sans travail audio",
        ],
      },
      {
        type: "h2",
        contenu: "Le film cinématographique",
      },
      {
        type: "p",
        contenu:
          "Le film cinématographique est une œuvre narrative. Le vidéaste choisit les moments, construit une histoire, travaille la lumière, sélectionne une bande-son qui amplifie l'émotion. Le résultat ressemble davantage à un court-métrage qu'à un enregistrement.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000&q=80",
        alt: "Tournage cinématographique d'un mariage",
        legende: "Le film cinématographique raconte votre histoire comme au cinéma",
      },
      {
        type: "ul",
        items: [
          "✅ Un film que vous re-regarderez des dizaines de fois",
          "✅ Émotion décuplée par la narration et la musique",
          "✅ Esthétique soignée, images de haute qualité",
          "✅ Format court (5-20 min) — idéal à partager",
          "❌ Ne conserve pas tous les moments",
          "❌ Investissement plus important (montage long)",
        ],
      },
      {
        type: "h2",
        contenu: "Le teaser : le meilleur des deux mondes",
      },
      {
        type: "p",
        contenu:
          "Le teaser de 60 à 90 secondes est devenu incontournable. C'est une version ultra-condensée de votre film, pensée pour être partagée sur les réseaux sociaux. Livré souvent en 2 semaines, il vous permet de revivre l'émotion très rapidement après le mariage.",
      },
      {
        type: "quote",
        contenu:
          "« On m'a livré le teaser 10 jours après le mariage. J'ai pleuré pendant 90 secondes. Mes collègues au bureau, eux aussi. » — Marie & Thomas, mariés en mai 2024",
      },
      {
        type: "h2",
        contenu: "Notre recommandation",
      },
      {
        type: "p",
        contenu:
          "Si votre budget le permet, optez pour la combinaison film cinématographique (10-20 min) + teaser (60-90s). C'est ce que 80% de nos clients choisissent. Le film pour revivre, le teaser pour partager.",
      },
      {
        type: "p",
        contenu:
          "Si vous devez choisir : privilégiez le film cinématographique. Dans 10 ans, vous re-regarderez un film de 12 minutes. Vous ne re-regarderez pas un reportage de 3 heures.",
      },
      {
        type: "cta",
        contenu: "Découvrez nos formules photo et vidéo",
        lien: "/tarifs",
        bouton: "Voir les formules",
      },
    ],
  },
  {
    slug: "drone-mariage-tout-savoir",
    titre: "Drone de mariage : tout ce qu'il faut savoir avant de commander",
    metaDescription:
      "Drone de mariage : réglementation, météo, lieux autorisés, surcoût. Le guide complet pour des prises de vue aériennes réussies le jour J.",
    extrait:
      "Réglementation, météo, lieux autorisés, surcoût… Le guide complet sur la photographie et vidéo par drone pour votre mariage.",
    categorie: "Guides",
    date: "28 juillet 2024",
    dateISO: "2024-07-28",
    lecture: "7 min",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&q=80",
    imageAlt: "Drone photographiant un mariage",
    contenu: [
      {
        type: "intro",
        contenu:
          "Les prises de vue par drone ont révolutionné la photographie et vidéo de mariage ces dernières années. Ces images aériennes offrent des perspectives impossibles autrement. Mais avant de cocher la case « drone » dans votre devis, voici tout ce qu'il faut savoir.",
      },
      {
        type: "h2",
        contenu: "La réglementation française : ce qui est autorisé",
      },
      {
        type: "p",
        contenu:
          "En France, le survol de personnes avec un drone est strictement encadré. Les règles ont évolué en 2023 avec la mise en application du règlement européen. Voici l'essentiel :",
      },
      {
        type: "ul",
        items: [
          "Le pilote doit être titulaire de la certification A1/A3 (théorique) au minimum",
          "Interdit de survoler des rassemblements de personnes sans autorisation préfectorale",
          "Certaines zones sont interdites de vol (proches d'aéroports, zones militaires, centres-villes de grandes métropoles)",
          "Le drone doit rester en vue directe du pilote",
          "Respecter les distances minimales de sécurité",
        ],
      },
      {
        type: "p",
        contenu:
          "Notre équipe est certifiée et gère toutes les démarches administratives en amont. Pour certains lieux (Paris intra-muros, certains sites classés), des autorisations spéciales sont nécessaires et peuvent prendre plusieurs semaines — à anticiper.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=1000&q=80",
        alt: "Vue aérienne d'un mariage",
        legende: "Les prises de vue aériennes offrent des perspectives uniques sur votre lieu de réception",
      },
      {
        type: "h2",
        contenu: "Météo et drone : les conditions idéales",
      },
      {
        type: "p",
        contenu:
          "Le drone est très dépendant des conditions météo. Les vents au-delà de 40 km/h rendent le vol instable et dangereux. La pluie est évidemment incompatible. Un ciel uniformément gris produit des images plates et peu dynamiques.",
      },
      {
        type: "p",
        contenu:
          "Les meilleures conditions : vent nul à faible, lumière de fin de journée (golden hour), quelques nuages pour créer du volume dans le ciel. Nous avons toujours un plan B préparé en cas de météo défavorable.",
      },
      {
        type: "quote",
        contenu:
          "« Nous prévoyons toujours deux créneaux drone dans la journée. Si le premier est raté à cause de la météo ou de l'organisation, on récupère sur le second. »",
      },
      {
        type: "h2",
        contenu: "Les lieux et leurs contraintes",
      },
      {
        type: "p",
        contenu:
          "Tous les lieux de réception ne se prêtent pas également au drone. Voici un guide rapide :",
      },
      {
        type: "ul",
        items: [
          "🟢 Château avec grand parc : idéal, dégagement total",
          "🟢 Mas provençal / domaine viticole : parfait pour les vues aériennes",
          "🟢 Plage : magnifique si hors zone de baignade surveillée",
          "🟡 Jardin en ville : possible selon localisation, vérification nécessaire",
          "🔴 Paris intra-muros : autorisations complexes, délais longs",
          "🔴 Proches d'un aéroport (< 5km) : interdit sans dérogation spéciale",
        ],
      },
      {
        type: "h2",
        contenu: "Qu'est-ce qu'on capture avec le drone ?",
      },
      {
        type: "p",
        contenu:
          "Le drone apporte trois types de valeur à votre reportage :",
      },
      {
        type: "ol",
        items: [
          "Les plans de situation — montrer le lieu dans son environnement, révéler l'ampleur de la réception",
          "Les plans de groupe — vue aérienne sur l'ensemble des invités, une image impossible autrement",
          "Les plans dramatiques — le couple seul dans un grand paysage, décollage du château, coucher de soleil",
        ],
      },
      {
        type: "h2",
        contenu: "Le coût du drone : ce que ça représente vraiment",
      },
      {
        type: "p",
        contenu:
          "L'option drone représente un surcoût de 300 à 500€ en moyenne. Ce prix couvre : le drone professionnel (DJI Mavic 3 ou équivalent), la certification du pilote, les démarches administratives, le temps de tournage et le montage des séquences aériennes dans votre film.",
      },
      {
        type: "cta",
        contenu: "Le drone est inclus dans nos formules Premium et Prestige",
        lien: "/tarifs",
        bouton: "Voir les formules",
      },
    ],
  },
  {
    slug: "album-photo-mariage-comment-choisir",
    titre: "Album photo de mariage : formats, papiers, reliures — comment choisir",
    metaDescription:
      "Comment choisir son album photo de mariage ? Formats, papiers Fine Art, reliures, nombre de pages… Le guide expert pour un album qui dure 100 ans.",
    extrait:
      "L'album photo est le seul support qui traversera les générations. Voici comment choisir un album qui sera encore magnifique dans 50 ans.",
    categorie: "Conseils",
    date: "15 juin 2024",
    dateISO: "2024-06-15",
    lecture: "5 min",
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1200&q=80",
    imageAlt: "Album photo de mariage",
    contenu: [
      {
        type: "intro",
        contenu:
          "Dans 30 ans, vos enfants n'ouvriront pas un disque dur pour regarder vos photos de mariage. Ils ouvriront un album. C'est le seul support qui traverse vraiment le temps. Voici comment choisir celui qui mérite d'être transmis.",
      },
      {
        type: "h2",
        contenu: "Le format : plus grand que vous ne le pensez",
      },
      {
        type: "p",
        contenu:
          "Le format 20x20 cm est souvent choisi pour des raisons de budget. C'est une erreur. Les photos de mariage méritent d'être grandes. Nos recommandations :",
      },
      {
        type: "ul",
        items: [
          "20x20 cm : format minimum, acceptable pour un album secondaire",
          "30x30 cm : le bon compromis qualité/prix, notre recommandation standard",
          "40x40 cm : le format premium, idéal pour les doubles pages panoramiques",
          "50x25 cm : format panoramique, idéal pour les photos de cérémonie",
        ],
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&q=80",
        alt: "Album photo mariage ouvert",
        legende: "Un album 30x30 cm en papier Fine Art — la référence qualité",
      },
      {
        type: "h2",
        contenu: "Le papier : la différence entre 10 ans et 100 ans",
      },
      {
        type: "p",
        contenu:
          "Le papier est la décision la plus importante pour la longévité de votre album. Il existe deux grandes catégories :",
      },
      {
        type: "h3",
        contenu: "Le papier chromogène classique",
      },
      {
        type: "p",
        contenu:
          "C'est le papier photo standard. Brillant ou mat, il est produit par voie chimique comme les photos argentiques. Bonne reproduction des couleurs, bon contraste. Durée de vie estimée : 40-60 ans en conditions normales.",
      },
      {
        type: "h3",
        contenu: "Le papier Fine Art (Baryta ou Hahnemühle)",
      },
      {
        type: "p",
        contenu:
          "C'est la référence des musées et galeries d'art. Impression jet d'encre sur papier coton ou fibres naturelles. Rendu exceptionnel des détails et des tons, profondeur des noirs incomparable. Durée de vie estimée : 100 à 200 ans. C'est ce que nous utilisons pour nos albums premium.",
      },
      {
        type: "h2",
        contenu: "La reliure : rigide ou semi-rigide ?",
      },
      {
        type: "p",
        contenu:
          "La reliure détermine comment votre album s'ouvre et se tient dans le temps.",
      },
      {
        type: "ul",
        items: [
          "Reliure lay-flat : les pages s'ouvrent à plat, idéale pour les doubles pages panoramiques",
          "Reliure cousue : la plus solide, utilisée pour les livres d'art haut de gamme",
          "Couverture cuir : intemporelle, personnalisable avec vos prénoms et date",
          "Couverture acrylique : moderne, avec photo intégrée dans la couverture",
        ],
      },
      {
        type: "h2",
        contenu: "Nombre de photos et mise en page",
      },
      {
        type: "p",
        contenu:
          "La tentation est de mettre le maximum de photos. C'est une erreur de débutant. Un album de mariage doit être épuré, rythmé, raconter une histoire. Nos guidelines :",
      },
      {
        type: "ul",
        items: [
          "40 pages double face = environ 80-100 photos idéalement",
          "Alternez pages full-bleed (1 photo) et pages multi-photos",
          "Conservez les blancs — ils donnent de la respiration à l'ensemble",
          "Organisez chronologiquement pour raconter l'histoire de la journée",
        ],
      },
      {
        type: "quote",
        contenu:
          "« Nos clients qui ont commandé un album Fine Art 40x40 cm nous contactent parfois des années après pour nous dire que c'est leur bien le plus précieux. Pas leur maison, pas leur voiture — leur album. »",
      },
      {
        type: "cta",
        contenu: "L'album Fine Art 40x40 est inclus dans notre formule Prestige",
        lien: "/tarifs",
        bouton: "Voir les formules",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
