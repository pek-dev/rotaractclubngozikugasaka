import { Activity, EventItem, TeamMember, Testimonial, GalleryItem, NewsArticle, FAQItem } from '../types';

export const ACTIVITIES_DATA: Activity[] = [
  {
    id: 'act-1',
    title: 'Collecte Majeure de Sang',
    category: 'sante',
    categoryLabel: 'Santé',
    date: '15 Mars 2026',
    location: 'Centre de Santé de Ngozi',
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80',
    description: 'Campagne annuelle de don de sang en partenariat avec le Centre National de Transfusion Sanguine et la Croix-Rouge du Burundi.',
    fullContent: 'Plus de 150 poches de sang ont été collectées grâce à la mobilisation exemplaire des jeunes de la province de Ngozi. Cette action permet de sauver des vies urgentes dans les hôpitaux régionaux.',
    impactMetrics: '150+ poches collectées • 450 vies potentielles sauvées'
  },
  {
    id: 'act-2',
    title: 'Plantation de 500 Arbres à Ngozi',
    category: 'environnement',
    categoryLabel: 'Environnement',
    date: '22 Avril 2026',
    location: 'Colline Kugasaka, Ngozi',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    description: 'Opération de reboisement et de lutte contre l erosion des sols en impliquant les étudiants et riverains de Ngozi.',
    fullContent: 'Dans le cadre de la Journée de la Terre, nos bénévoles ont mis en terre 500 arbres fruitiers et forestiers pour préserver notre biodiversité et sensibiliser les générations futures.',
    impactMetrics: '500 arbres plantés • 12 hectares protégés'
  },
  {
    id: 'act-3',
    title: 'Atelier Intensif en Leadership & Éloquence',
    category: 'formation',
    categoryLabel: 'Formation',
    date: '10 Mai 2026',
    location: 'Université de Ngozi',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    description: 'Session interactive axée sur la prise de parole en public, la gestion de projets communautaires et le leadership éthique.',
    fullContent: '60 étudiants et jeunes professionnels ont bénéficié d exercices pratiques, de simulations de débats et de coaching personnalisé par des mentors aguerris du Rotary.',
    impactMetrics: '60 jeunes formés • 8 modules dispensés'
  },
  {
    id: 'act-4',
    title: 'Soutien aux Enfants de l Orphelinat',
    category: 'humanitaire',
    categoryLabel: 'Humanitaire',
    date: '1er Juin 2026',
    location: 'Orphelinat Sainte-Marie de Ngozi',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    description: 'Distribution de fournitures scolaires, kits d hygiène, vêtements et vêtements de sport, suivis d un repas partagé.',
    fullContent: 'Une journée chaleureuse marquée par des jeux collectifs, des ateliers artistiques et une dotation complète de kits d apprentissage pour soutenir la scolarisation de 85 enfants.',
    impactMetrics: '85 enfants parrainés • 200 kits distribués'
  },
  {
    id: 'act-5',
    title: 'Journée de Salubrité Publique',
    category: 'environnement',
    categoryLabel: 'Environnement',
    date: '5 Juin 2026',
    location: 'Marché Central de Ngozi',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80',
    description: 'Grande opération "Ville Propre" visant à nettoyer les espaces collectifs et recycler les déchets plastiques.',
    fullContent: 'Mobilisation de plus de 80 volontaires munis de balais, gants et bacs de tri. Sensibilisation directe auprès de 300 commerçants de Ngozi.',
    impactMetrics: '2.5 tonnes de déchets nettoyées • 300 commerçants sensibilisés'
  },
  {
    id: 'act-6',
    title: 'Caravane de Prévention Santé',
    category: 'sante',
    categoryLabel: 'Santé',
    date: '20 Juin 2026',
    location: 'Commune Ruhororo',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80',
    description: 'Consultations gratuites, dépistages du diabète et de l hypertension, et ateliers d hygiène buccale.',
    fullContent: 'Des médecins membres et partenaires se sont déplacés en zone rurale pour offrir des diagnostics gratuits et distribuer des moustiquaires imprégnées.',
    impactMetrics: '320 consultations gratuites • 150 moustiquaires offertes'
  },
  {
    id: 'act-7',
    title: 'Mentorat Éducatif & Alphabétisation',
    category: 'education',
    categoryLabel: 'Éducation',
    date: '12 Juillet 2026',
    location: 'Bibliothèque Communale de Ngozi',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80',
    description: 'Programme de soutien scolaire du week-end et club de lecture pour les écoliers défavorisés.',
    fullContent: 'Accompagnement continu dans la maîtrise du français et des mathématiques, couplé à la création de coins lecture dans 3 écoles partenaires.',
    impactMetrics: '120 écoliers suivis • 450 livres distribués'
  },
  {
    id: 'act-8',
    title: 'Consultations Ophtalmiques & Paires de Lunettes',
    category: 'sante',
    categoryLabel: 'Santé',
    date: '25 Juillet 2026',
    location: 'Hôpital Régional de Ngozi',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80',
    description: 'Examens de la vue gratuits et fourniture de lunettes correctrices pour les élèves en difficulté visuelle.',
    fullContent: 'Grâce à notre partenariat avec des opticiens bénévoles, 90 enfants ont reçu des lunettes neuves pour poursuivre leurs études sans gêne visuelle.',
    impactMetrics: '210 tests visuels • 90 paires distribuées'
  }
];

export const EVENTS_DATA: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Assemblée Générale Annuelle & Bilan',
    day: '15',
    month: 'AOÛT',
    year: '2026',
    time: '14:00 - 17:30',
    location: 'Salle de Conférence Kugasaka, Ngozi',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    description: 'Présentation du bilan financier et moral de l année, élections du nouveau comité d administration et réseautage.',
    spotsLeft: 25,
    category: 'Officiel'
  },
  {
    id: 'evt-2',
    title: 'Sommet de la Jeunesse & du Leadership',
    day: '22',
    month: 'AOÛT',
    year: '2026',
    time: '09:00 - 16:30',
    location: 'Grand Amphithéâtre, Université de Ngozi',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
    description: 'Conférences inspirantes, tables rondes avec des entrepreneurs burundais et ateliers interactifs sur le leadership mondial.',
    spotsLeft: 40,
    category: 'Conférence'
  },
  {
    id: 'evt-3',
    title: 'Grand Gala de Charité "Ngozi Kugasaka"',
    day: '05',
    month: 'SEPT',
    year: '2026',
    time: '18:30 - 23:00',
    location: 'Hôtel Panorama, Ngozi',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    description: 'Soirée caritative de levée de fonds pour financer nos bourses d études et projets d accès à l eau potable.',
    spotsLeft: 18,
    category: 'Gala / Culture'
  }
];

export const TEAM_DATA: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Jean-Pierre Ndayishimiye',
    role: 'Président du Club',
    bio: 'Engagé depuis 5 ans dans le mouvement Rotaract, passionné de développement communautaire et de gestion de projets d impact.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    email: 'jp.ndayishimiye@rotaractngozi.bi',
    linkedin: '#',
    facebook: '#'
  },
  {
    id: 'tm-2',
    name: 'Marie-Claire Uwimana',
    role: 'Secrétaire Générale',
    bio: 'Diplômée en communication, elle orchestre la coordination interne, la rédaction administrative et les partenariats stratégiques.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    email: 'mc.uwimana@rotaractngozi.bi',
    linkedin: '#',
    facebook: '#'
  },
  {
    id: 'tm-3',
    name: 'Patrick Habimana',
    role: 'Trésorier',
    bio: 'Spécialiste en gestion financière et comptabilité publique, garant de la transparence et de la rigueur budgétaire du club.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    email: 'p.habimana@rotaractngozi.bi',
    linkedin: '#'
  },
  {
    id: 'tm-4',
    name: 'Grace Nkurunziza',
    role: 'Directrice des Projets',
    bio: 'Innovatrice sociale responsable des actions sur le terrain, du suivi d impact et de l encadrement des volontaires.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=80',
    email: 'g.nkurunziza@rotaractngozi.bi',
    linkedin: '#'
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Jean-Pierre N.',
    role: 'Président du Club',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    quote: 'Le Rotaract Club Ngozi Kugasaka a transformé ma vision du leadership. Chaque action collective nous rapproche de notre idéal de fraternité et de service.',
    rating: 5
  },
  {
    id: 'test-2',
    name: 'Marie-Claire U.',
    role: 'Secrétaire Générale',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    quote: 'Rejoindre une famille de jeunes déterminés qui agissent concrètement pour la communauté m a permis de me révéler et d acquérir une solide expérience professionnelle.',
    rating: 5
  },
  {
    id: 'test-3',
    name: 'Dr. Alexis Bukuru',
    role: 'Partenaire Médical - Hôpital Ngozi',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    quote: 'Leur engagement lors des campagnes de don de sang est admirable. La rigueur et le dynamisme du club font d eux un partenaire inestimable pour le secteur de la santé.',
    rating: 5
  }
];

export const GALLERY_DATA: GalleryItem[] = [
  { id: 'gal-1', title: 'Equipe lors du Don de Sang', category: 'Santé', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80', date: 'Mars 2026' },
  { id: 'gal-2', title: 'Reforestation Kugasaka', category: 'Environnement', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=80', date: 'Avril 2026' },
  { id: 'gal-3', title: 'Plantation citoyenne', category: 'Environnement', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80', date: 'Mai 2026' },
  { id: 'gal-4', title: 'Sourires à l Orphelinat', category: 'Humanitaire', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80', date: 'Juin 2026' },
  { id: 'gal-5', title: 'Opération Nettoyage Marché', category: 'Environnement', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80', date: 'Juin 2026' },
  { id: 'gal-6', title: 'Session Leadership Etudiants', category: 'Formation', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80', date: 'Mai 2026' },
  { id: 'gal-7', title: 'Campagne Dépistage Santé', category: 'Santé', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80', date: 'Juin 2026' },
  { id: 'gal-8', title: 'Distribution de paires de lunettes', category: 'Santé', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80', date: 'Juillet 2026' },
  { id: 'gal-9', title: 'Club de Lecture Enfant', category: 'Éducation', image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80', date: 'Juillet 2026' }
];

export const NEWS_DATA: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Lancement du Programme Académie de Leadership 2026',
    category: 'Annonce',
    date: '20 Juillet 2026',
    readTime: '3 min',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=80',
    summary: 'Notre nouveau parcours de coaching intensif ouvre ses portes à 50 jeunes prometteurs de la région de Ngozi pour développer leurs compétences managériales.',
    content: 'Le Rotaract Club Ngozi Kugasaka est fier d annoncer l ouverture des inscriptions pour l Académie de Leadership 2026. Ce programme structuré s étendra sur 6 mois et abordera la prise de décision éthique, l élaboration de plans de financement communautaires, la communication digitale et le travail d équipe. Des intervenants internationaux et des cadres locaux animeront ces modules gratuits.',
    author: 'Marie-Claire Uwimana'
  },
  {
    id: 'news-2',
    title: 'Cap des 500 Arbres Franchi avec Succès !',
    category: 'Environnement',
    date: '15 Juillet 2026',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    summary: 'Une grande journée d action environnementale a permis la plantation de plus de 500 plants fruitiers sur les collines environnantes de Ngozi.',
    content: 'Grâce à la mobilisation de plus de 100 volontaires civils, écoliers et membres du club, l opération Kugasaka Vert a atteint son objectif annuel en moins de 6 heures. Les riverains se sont engagés à assurer l arrosage et le suivi de croissance des arbres fruitiers qui contribueront à la fois à l ombrage et à l autonomie alimentaire locale.',
    author: 'Patrick Habimana'
  },
  {
    id: 'news-3',
    title: 'Record de Participation pour la Collecte de Sang',
    category: 'Santé',
    date: '10 Juillet 2026',
    readTime: '2 min',
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80',
    summary: '150 poches de sang récoltées en une journée, permettant de renflouer les réserves d urgence des hôpitaux du district de Ngozi.',
    content: 'La solidarité a une fois de plus brillé à Ngozi. Face au besoin pressant exprimé par le Centre de Transfusion Sanguine, nos équipes ont organisé un stand itinérant au cœur de la ville. Bravo à tous les donneurs de sang d avoir accompli ce geste citoyen sauvant des vies.',
    author: 'Jean-Pierre Ndayishimiye'
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Comment rejoindre le Rotaract Club Ngozi Kugasaka ?',
    answer: 'Il vous suffit de remplir notre formulaire de candidature en ligne ("Devenir Membre") ou d assister à l une de nos réunions d accueil bimensuelles. L adhésion est ouverte à toute personne motivée âgée de 18 à 30 ans.',
    category: 'adhesion'
  },
  {
    id: 'faq-2',
    question: 'Quels sont les critères d adhésion et le coût de la cotisation ?',
    answer: 'Aucune condition de diplôme n est requise : seule la volonté de servir la communauté et l esprit d équipe comptent. Une cotisation annuelle modique couvre les frais administratifs du club et l insigne officiel.',
    category: 'adhesion'
  },
  {
    id: 'faq-3',
    question: 'Faut-il être membre du Rotary pour rejoindre le Rotaract ?',
    answer: 'Non ! Le Rotaract est un club autonome parrainé par le Rotary. Vous devenez directement membre à part entière du mouvement Rotaract mondial dès votre intronisation.',
    category: 'general'
  },
  {
    id: 'faq-4',
    question: 'Comment mon entreprise ou organisation peut-elle devenir partenaire ?',
    answer: 'Nous proposons plusieurs formules de partenariats : sponsoring de projets humanitaires, dons de matériel, co-organisation d événements ou mécénat de compétences. Contactez-nous par email ou via le formulaire de contact.',
    category: 'partenariat'
  },
  {
    id: 'faq-5',
    question: 'Les activités sont-elles gratuites pour le public ?',
    answer: 'Oui, la quasi-totalité de nos actions sur le terrain (dépistages, dons, nettoyages, ateliers ouverts) sont 100% gratuites pour les bénéficiaires et les volontaires.',
    category: 'activites'
  }
];

export const PARTNERS_DATA = [
  { name: 'Rotary International', icon: 'Globe', color: 'text-pink-600' },
  { name: 'Rotary Club Ngozi', icon: 'Award', color: 'text-blue-600' },
  { name: 'Université de Ngozi', icon: 'GraduationCap', color: 'text-emerald-600' },
  { name: 'Croix-Rouge Burundi', icon: 'HeartPulse', color: 'text-red-600' },
  { name: 'CECONGO', icon: 'Building2', color: 'text-amber-600' },
  { name: 'American Corner', icon: 'BookOpenCheck', color: 'text-indigo-600' },
  { name: 'Umurundi Art Team', icon: 'Palette', color: 'text-purple-600' },
  { name: 'PekDev Tech', icon: 'Code', color: 'text-cyan-600' }
];

export const SOCIAL_POSTS_DATA = [
  {
    id: 'soc-1',
    platform: 'instagram' as const,
    authorName: 'Rotaract Club Ngozi Kugasaka',
    authorHandle: '@rotaract_ngozi',
    authorAvatar: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=150&auto=format&fit=crop&q=80',
    content: '🌳 Opération Kugasaka Vert : Plus de 500 plants fruitiers mis en terre aujourd hui à Ngozi ! Un immense merci à tous nos bénévoles, aux étudiants de l Université de Ngozi et à nos partenaires du Rotary Club. Ensemble pour un Burundi verdoyant ! 🇧🇮💚',
    mediaUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image' as const,
    timestamp: 'Il y a 2 heures',
    likes: 142,
    comments: 28,
    shares: 19,
    postUrl: 'https://instagram.com/p/rotaract_ngozi_kugasaka_1',
    hashtags: ['#RotaractNgozi', '#KugasakaVert', '#EnvironnementBurundi', '#ServiceAboveSelf', '#District9150']
  },
  {
    id: 'soc-2',
    platform: 'twitter' as const,
    authorName: 'Rotaract Ngozi Kugasaka',
    authorHandle: '@rotaract_ngozi',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    content: '🩸 RECORD BATTU ! 150 poches de sang collectées lors de notre grande journée citoyenne de don de sang en collaboration avec le Centre Régional de Transfusion Sanguine. Chaque goutte compte ! Bravo à tous nos héroïques donneurs de Ngozi. 👏',
    mediaUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image' as const,
    timestamp: 'Hier à 16:45',
    likes: 215,
    comments: 42,
    shares: 67,
    postUrl: 'https://x.com/rotaract_ngozi/status/1812345678',
    hashtags: ['#DonDeSang', '#SauverDesVies', '#NgoziBurundi', '#RotaractInAction']
  },
  {
    id: 'soc-3',
    platform: 'facebook' as const,
    authorName: 'Rotaract Club Ngozi Kugasaka',
    authorHandle: '@rotaractngozikugasaka',
    authorAvatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=150&auto=format&fit=crop&q=80',
    content: '📚 Visite chaleureuse à l Orphelinat Sainte-Marie de Ngozi. Remise de 200 kits scolaires, livres de lecture et vêtements pour soutenir la réussite académique de nos jeunes frères et sœurs. La fraternité en action !',
    mediaUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image' as const,
    timestamp: '25 Juillet 2026',
    likes: 380,
    comments: 54,
    shares: 88,
    postUrl: 'https://facebook.com/rotaractngozikugasaka/posts/987654321',
    hashtags: ['#ÉducationPourTous', '#SolidaritéNgozi', '#RotaractDist9150']
  },
  {
    id: 'soc-4',
    platform: 'youtube' as const,
    authorName: 'Rotaract Ngozi Official Channel',
    authorHandle: '@rotaractngozikugasaka',
    authorAvatar: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=150&auto=format&fit=crop&q=80',
    content: '🎬 NOUVELLE VIDÉO : Rétrospective complète du Sommet de la Jeunesse & du Leadership 2026 à l Université de Ngozi. Découvrez les témoignages émouvants de nos boursiers et mentors !',
    mediaUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
    mediaType: 'video' as const,
    timestamp: '20 Juillet 2026',
    likes: 490,
    comments: 73,
    shares: 110,
    postUrl: 'https://youtube.com/watch?v=rotaract_ngozi_leadership',
    hashtags: ['#LeadershipJeunesse', '#UniversitéNgozi', '#RotaractBurundi']
  },
  {
    id: 'soc-5',
    platform: 'instagram' as const,
    authorName: 'Rotaract Club Ngozi Kugasaka',
    authorHandle: '@rotaract_ngozi',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content: '✨ Préparatifs du Grand Gala de Charité "Ngozi Kugasaka" ! Réservez votre place pour une soirée mémorable au profit de l accès à l eau potable dans les zones rurales de la province. Billets disponibles dès maintenant ! 🎟️💃',
    mediaUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image' as const,
    timestamp: '18 Juillet 2026',
    likes: 189,
    comments: 31,
    shares: 24,
    postUrl: 'https://instagram.com/p/gala_ngozi_2026',
    hashtags: ['#GalaRotaract', '#EauPotable', '#HumanitaireBurundi']
  }
];
