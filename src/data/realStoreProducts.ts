// منتجات المتاجر الحقيقية مع الصور والبيانات المحدثة

export interface RealProduct {
  id: number;
  storeId: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  images: string[];
  sizes: string[];
  availableSizes: string[];
  colors: Array<{ name: string; value: string }>;
  rating: number;
  reviews: number;
  views: number;
  likes: number;
  orders: number;
  quantity?: number;
  category: string;
  inStock: boolean;
  isAvailable: boolean;
  tags: string[];
  badge?: string;
  image: string;
}

// منتجات متجر بريتي (ID: 3) - عطور فاخرة
export const prettyProducts: RealProduct[] = [
  {
    id: 3001,
    storeId: 3,
    name: "عطر MEGARA للجنسين",
    description: "عطر MEGARA للجنسين هو عطر مميز بتركيبة فريدة تجمع بين الروائح الشرقية والغربية، مما يجعله مناسباً للرجال والنساء على حد سواء. يتميز بثباتية عالية تدوم طوال اليوم، ويحتوي على تركيبة eau de Perfume مركزة تجعل منه خياراً مثالياً للمناسبات الخاصة واليومية.",
    price: 165,
    originalPrice: 195,
    images: ["/assets/real-stores/pretty/image3.jpg"],
    image: "/assets/real-stores/pretty/image3.jpg",
    sizes: ["50ml"],
    availableSizes: ["50ml"],
    colors: [{ name: "شفاف", value: "#FFFFFF" }],
    rating: 4.8,
    reviews: 45,
    views: 189,
    likes: 98,
    orders: 23,
    category: "عطور",
    inStock: true,
    isAvailable: true,
    tags: ["جديد"],
    badge: "خصم 15%"
  },
  {
    id: 3002,
    storeId: 3,
    name: "عطر CELEBRITY للرجال",
    description: "عطر رجالي خشبي يجمع بين عطرين الافتتاحية عطر قرلان لانستنت وبعد 10 دقائق يشبه عطر ديور اوم انتنس عطر ذو كاريزما قوية للرجل العصري ذو شخصية قوية مناسب لفصل الشتاء والربيع",
    price: 200,
    originalPrice: 230,
    images: ["/assets/real-stores/pretty/image5.jpg","/assets/real-stores/pretty/image13.jpg"],
    image: "/assets/real-stores/pretty/image5.jpg",
    sizes: ["100ml"],
    availableSizes: ["100ml"],
    colors: [{ name: "شفاف", value: "#FFFFFF" }],
    rating: 4.7,
    reviews: 67,
    views: 234,
    likes: 145,
    orders: 34,
    category: "عطور رجالية",
    inStock: true,
    isAvailable: true,
    tags: ["مميزة"],
    badge: "خصم 13%"
  },
  {
    id: 3003,
    storeId: 3,
    name: "عطر ابن العز للرجال",
    description: "عطر رجالي مكون من خشب الصندل وفوحان زهرة الياسمين عطر ابن العز يدوم بمجرد 10 دقائق يشبه عطر دافيدوف لايت عطر ذو كاريزما قوية للرجل العصري ذو شخصية قوية مناسب لفصل الشتاء والربيع",
    price: 95,
    originalPrice: 135,
    images: ["/assets/real-stores/pretty/image4.jpg","/assets/real-stores/pretty/image10.jpg"],
    image: "/assets/real-stores/pretty/image4.jpg",
    sizes: ["100ml"],
    availableSizes: ["100ml"],
    colors: [{ name: "شفاف", value: "#FFFFFF" }],
    rating: 4.6,
    reviews: 89,
    views: 267,
    likes: 123,
    orders: 45,
    category: "عطور رجالية",
    inStock: true,
    isAvailable: true,
    tags: ["تخفيضات"],
    badge: "خصم 30%"
  },
  {
    id: 3004,
    storeId: 3,
    name: "عطر Candid للرجال",
    description: "عطر attractive للرجال TADangel Attractive Pour Homme للرجال هو العطر الليلي المثالي. تخلق رائحتها الدافئة والحسية من الخشب والتوابل والجلود هالة مغرية تجعلك تشعر بأنك لا تقاوم. استمتع بأمسية لا تنسى مع هذا العطر الآسر حقا. مقدمة العطر : الفلفل الوردي ، عنبر، الروائح الوسطى: لافندر، Olibanum ، حمضيات المكونات الأساسية: الفانيليا، ، تونيك",
    price: 49.95,
    originalPrice: 135,
    images: ["/assets/real-stores/pretty/image6.png","/assets/real-stores/pretty/image15.jpg"],
    image: "/assets/real-stores/pretty/image6.png",
    sizes: ["100ml"],
    availableSizes: ["100ml"],
    colors: [{ name: "شفاف", value: "#FFFFFF" }],
    rating: 4.5,
    reviews: 56,
    views: 198,
    likes: 87,
    orders: 28,
    category: "عطور رجالية",
    inStock: true,
    isAvailable: true,
    tags: ["تخفيضات"],
    badge: "خصم 37%"
  },
  {
    id: 3005,
    storeId: 3,
    name: "عطر PLEIN FATALE ROSE للنساء",
    description: "عطر بلين فاتال روزيه الجذاب والحسي، هو عطر فاتال الجديد للمرأة التي تفضل أن تكون رائدة في حياتها. إنه سحر المجهول، وغموض الغموض، وقوة الأنوثة النقية التي تنبض بالحياة مع كل رشة عطر زهري - فواكه للنساء. هذا عطر جديد صدر عام 2023 افتتاحية العطر الليتشي, الكشمش الأسود والبرتقال البرازيلي; قلب العطر براعم الورد وياسمين سامباك; قاعدة العطر تتكون من الأمبروكسان, خشب الصندل والعرعر.",
    price: 295,
    originalPrice: 320,
    images: ["/assets/real-stores/pretty/image14.jpg"],
    image: "/assets/real-stores/pretty/image14.jpg",
    sizes: ["90ml"],
    availableSizes: ["90ml"],
    colors: [{ name: "شفاف", value: "#FFFFFF" }],
    rating: 4.9,
    reviews: 34,
    views: 145,
    likes: 78,
    orders: 19,
    category: "عطور نسائية",
    inStock: true,
    isAvailable: true,
    tags: ["جديد"],
    badge: "خصم 8%"
  },
  {
    id: 3006,
    storeId: 3,
    name: "عطر Girl Of Now ELIE SAAB 90ml",
    description: "يتميز العطر بتركيبة مركزة ذات ثباتية عالية بلمسة شرقية زهرية للنساء اللواتي يتلألأن بالسعادة، يفتتح العطر بنوتات الأناناس، الفستق، الكمثرى واليوسفي وتتدرج الى قلب بنوتات الياسمين، براعم البرتقال، الأيلنغ واللوز المر ثم يختتم العطر بقاعدة عطرية خفيفة من زهور السوسن، الفانيلا والباتشولي",
    price: 445.2,
    originalPrice: 530,
    images: ["/assets/real-stores/pretty/image11.jpg","/assets/real-stores/pretty/image18.jpg"],
    image: "/assets/real-stores/pretty/image11.jpg",
    sizes: ["90ml"],
    availableSizes: ["90ml"],
    colors: [{ name: "شفاف", value: "#FFFFFF" }],
    rating: 4.8,
    reviews: 67,
    views: 234,
    likes: 145,
    orders: 38,
    category: "عطور نسائية",
    inStock: true,
    isAvailable: true,
    tags: ["مميزة"],
    badge: "خصم 16%"
  },
  {
    id: 3007,
    storeId: 3,
    name: "عطر Girl Of Now ELIE SAAB 50ml",
    description: "ايلي صعب جيرل اوف ناو فوريفر عطر نسائي لا نهاية له وفريد من نوعه، رائحته رقيقة وجميلة بمزيج الأزهار الناعمة مع الفواكه الحيوية، يناسب المرأة العصرية الشابة التي ترغب في الإثارة والإغراء وجذب الانتباه إليها فيضيف لها لمسات من الأناقة والجاذبية لا تنتهي",
    price: 364.5,
    originalPrice: 380,
    images: ["/assets/real-stores/pretty/image1.jpg","/assets/real-stores/pretty/image29.jpg"],
    image: "/assets/real-stores/pretty/image1.jpg",
    sizes: ["50ml"],
    availableSizes: ["50ml"],
    colors: [{ name: "شفاف", value: "#FFFFFF" }],
    rating: 4.7,
    reviews: 45,
    views: 189,
    likes: 98,
    orders: 26,
    category: "عطور نسائية",
    inStock: true,
    isAvailable: true,
    tags: ["مميزة"],
    badge: "خصم 4%"
  },
  {
    id: 3008,
    storeId: 3,
    name: "عطر Versace Eros Eau De Toilette رجال",
    description: "يشع هالة آسرة: حسية على البشرة، وذكورية مطمئنة. هذا العطر يجسد المغوي المنتصر والمبهر. هالة مضيئة ذات نضارة كثيفة، نابضة وحيوية بشكل استثنائي، يتم الحصول عليها من مزيج أوراق النعناع، قشر الليمون",
    price: 373,
    originalPrice: 410,
    images: ["/assets/real-stores/pretty/image2.jpg","/assets/real-stores/pretty/image16.jpg"],
    image: "/assets/real-stores/pretty/image2.jpg",
    sizes: ["100ml"],
    availableSizes: ["100ml"],
    colors: [{ name: "شفاف", value: "#FFFFFF" }],
    rating: 4.8,
    reviews: 78,
    views: 267,
    likes: 156,
    orders: 42,
    category: "عطور رجالية",
    inStock: true,
    isAvailable: true,
    tags: ["أكثر طلباً"],
    badge: "خصم 9%"
  },
  {
    id: 3009,
    storeId: 3,
    name: "عطر Especially Escada Escada",
    description: "وهو ينفرد عن سواه بقوام ناعم ومخملي يتمحور حول توليفة من شذى الورود. ويمثل عبق الورد ونضارته ونداوته قلب العطر، ويتكامل مع نفحات مائية من ندى الصباح وحسية زهور اليلانغ. وتستهل السيمفونية الشذية بنفحات من الكمثرى وبذور العنبر تسهم في تعزيز الحس النضر الذي يتسم به العطر، وتتحول إلى نفحات ختامية خفيفة من المسك",
    price: 285,
    originalPrice: 310,
    images: ["/assets/real-stores/pretty/image8.jpg","/assets/real-stores/pretty/image17.jpg"],
    image: "/assets/real-stores/pretty/image8.jpg",
    sizes: ["50ml"],
    availableSizes: ["50ml"],
    colors: [{ name: "شفاف", value: "#FFFFFF" }],
    rating: 4.7,
    reviews: 56,
    views: 198,
    likes: 89,
    orders: 31,
    category: "عطور نسائية",
    inStock: true,
    isAvailable: true,
    tags: ["أكثر إعجاباً"],
    badge: "خصم 8%"
  },
  {
    id: 3010,
    storeId: 3,
    name: "عطر My Burberry Blush",
    description: "هو أحدث العطور النسائية لبيت الأزياء البريطاني العريق العطر الجديد استوحى رقته من رقة وتمايل أزهار الصيف عند هبوب نسمات المساء وجاء بطابع زهري خلاب لقد أبدع الخبير العطري الشهير في خلط مكونات هذا العطر الخلاب إذ قام بافتتاح العطر برائحة الرمان والليمون, ثم زاد جرعة الرقة من خلال قلب العطر المفعم برائحة بتلات الورد ونبات ابرة الراعي مع التفاح الأخضر ثم ختم بقاعدة عطرية من الياسمين مع الوستارية",
    price: 488,
    originalPrice: 530,
    images: ["/assets/real-stores/pretty/image12.jpg","/assets/real-stores/pretty/image9.jpg"],
    image: "/assets/real-stores/pretty/image12.jpg",
    sizes: ["90ml"],
    availableSizes: ["90ml"],
    colors: [{ name: "شفاف", value: "#FFFFFF" }],
    rating: 4.9,
    reviews: 43,
    views: 167,
    likes: 98,
    orders: 25,
    category: "عطور نسائية",
    inStock: true,
    isAvailable: true,
    tags: ["أكثر مشاهدة"],
    badge: "خصم 8%"
  },
  {
    id: 3011,
    storeId: 3,
    name: "عطر BURBERRY HERO",
    description: "يستكشف عطر بربري هيرو الرجالي جانبًا بطوليًّا جديدًا يتسم بالجاذبية: شجاعة تقبّل المرء لذاته. وهو يروي قصة رجل يخوض رحلة لاستكشاف ذاته. حيث روح الاستكشاف والإحساس الداخلي لديه. تفيض طاقته بأحاسيس مرهفة تتجلى في حضور الحصان بوصفه مخلوقًا هائلًا يعبّر عن قوّة بطلنا يحتوي العطر على ثلاث زيوت من خشب الأرز الدافئ كقاعدة عطرية مُميزة، وينتهي برائحة منعشة ومتألقة. يفتتح العطر برائحة إبر الصنوبر النابضة بالحيوية مع البنزوين والبخور، ليصنع مزيجًا قويًا من الإحساس العميق",
    price: 464,
    originalPrice: 540,
    images: ["/assets/real-stores/pretty/image27.jpg","/assets/real-stores/pretty/image28.jpg"],
    image: "/assets/real-stores/pretty/image27.jpg",
    sizes: ["100ml"],
    availableSizes: ["100ml"],
    colors: [{ name: "شفاف", value: "#FFFFFF" }],
    rating: 4.8,
    reviews: 67,
    views: 234,
    likes: 145,
    orders: 38,
    category: "عطور رجالية",
    inStock: true,
    isAvailable: true,
    tags: ["أكثر إعجاباً"],
    badge: "خصم 14%"
  },
  {
    id: 3012,
    storeId: 3,
    name: "عطر Costume National Scent Intense",
    description: "يعبر عطر كوستوم عن الاناقة والجاذبية والرجولة المثالية عطر جذاب جدا مركز جدا وبثبات عظيم أيضا عطر تفاعلي مع جميع الأجواء بتركيبه من الباتشولي التي تجعل العطر هوا استفراد كامل لكل من حولك هوا جاذبية وسحر العنبر ليجعلك انت مصدر الفضول مكونات العطر افتتاحية العطر الشاي, القرفة, التفاح والبرغوث; قلب العطر الكركدية, الياسمين والدافانا قاعدة العطر تتكون من العنبر الكريستالي, العنبر, خشب الصندل, الباتشولي, الجلود واللبان.",
    price: 451,
    originalPrice: 485,
    images: ["/assets/real-stores/pretty/image19.jpg","/assets/real-stores/pretty/image23.jpg"],
    image: "/assets/real-stores/pretty/image19.jpg",
    sizes: ["100ml"],
    availableSizes: ["100ml"],
    colors: [{ name: "شفاف", value: "#FFFFFF" }],
    rating: 4.7,
    reviews: 52,
    views: 189,
    likes: 98,
    orders: 29,
    category: "عطور رجالية",
    inStock: true,
    isAvailable: true,
    tags: ["تخفيضات"],
    badge: "خصم 7%"
  },
  {
    id: 3013,
    storeId: 3,
    name: "عطر Hugo Intense",
    description: "عطر شرقي - فوچير للرجال . هذا عطر جديد Hugo Intense صدر عام 2023. افتتاحية العطر التفاح الأحمر, القرفة, الليم - الزيزفون والجريب فروت الأحمر; قلب العطر الزعتر الأحمر وإبره الراعي; قاعدة العطر تتكون من خشب الأرز, الجلود والباتشولي",
    price: 449,
    originalPrice: 510,
    images: ["/assets/real-stores/pretty/image24.jpg","/assets/real-stores/pretty/image21.jpg"],
    image: "/assets/real-stores/pretty/image24.jpg",
    sizes: ["125ml"],
    availableSizes: ["125ml"],
    colors: [{ name: "شفاف", value: "#FFFFFF" }],
    rating: 4.6,
    reviews: 78,
    views: 245,
    likes: 134,
    orders: 41,
    category: "عطور رجالية",
    inStock: true,
    isAvailable: true,
    tags: ["جديد"],
    badge: "خصم 12%"
  },
  {
    id: 3014,
    storeId: 3,
    name: "عطر Pasha De Cartier Perfume",
    description: "هو عطر شرقي فوجير مصمم خصيصًا للرجال، يعكس الأناقة والفخامة. أُطلق هذا العطر في عام 2020 من قبل دار الأزياء الفرنسي العريق Cartier، ويتميز بتركيبته الغنية التي تجمع بين النفحات الشرقية والخشبية، مما يجعله خيارًا مثاليًا للرجل العصري. عطر كارتير باشا بارفيوم هو خيار مثالي للرجل الباحث عن التميز والجاذبية، حيث يضفي عليه لمسة من الثقة والأناقة تدوم طوال اليوم",
    price: 538,
    originalPrice: 560,
    images: ["/assets/real-stores/pretty/image22.jpg","/assets/real-stores/pretty/image20.jpg"],
    image: "/assets/real-stores/pretty/image22.jpg",
    sizes: ["125ml"],
    availableSizes: ["125ml"],
    colors: [{ name: "شفاف", value: "#FFFFFF" }],
    rating: 4.9,
    reviews: 34,
    views: 156,
    likes: 78,
    orders: 19,
    category: "عطور رجالية",
    inStock: true,
    isAvailable: true,
    tags: ["أكثر مشاهدة"],
    badge: "خصم 4%"
  },
  {
    id: 3015,
    storeId: 3,
    name: "عطر Nomade Naturelle Chloé",
    description: "عطر جرجيوس من مايكل كورس تم اصداره عام 2021 تزهر بشكل رائع مع نوع جديد تمامًا من الثقة. إنه مزيج من التفاؤل الناجم عن باقة الزهور البيضاء الزاهية ولمسة من رائحة التبغ والرفاهية المريحة المعززة بروائح خشبية قوية افتتاحية العطر اليوسفي, المر والبرغموت; قلب العطر الإيلنغ, زهر البرتقال, ياسمين سامباك والسوسن; قاعدة العطر تتكون من التبغ, العنبر, خشب الأرز الأطلسي, اللبان, خشب الصندل والتونكا",
    price: 387,
    originalPrice: 430,
    images: ["/assets/real-stores/pretty/image25.jpg","/assets/real-stores/pretty/image26.jpg"],
    image: "/assets/real-stores/pretty/image25.jpg",
    sizes: ["75ml"],
    availableSizes: ["75ml"],
    colors: [{ name: "شفاف", value: "#FFFFFF" }],
    rating: 4.8,
    reviews: 56,
    views: 198,
    likes: 112,
    orders: 33,
    category: "عطور نسائية",
    inStock: true,
    isAvailable: true,
    tags: ["تخفيضات"],
    badge: "خصم 10%"
  }
];

// منتجات متجر شيرين (ID: 2) - متخصص في ملابس المناسبات أحجام كبيرة
export const sheirineProducts: RealProduct[] = [
  // ... (sheirine products)
];

// منتجات متجر شيرين (ID: 2) - متخصص في المجهورات
export const assetsProducts: RealProduct[] = [
  // ... (assets products)
];

// منتجات متجر ديلتا ستور (ID: 4)
export const deltaStoreProducts: RealProduct[] = [
  // ... (delta products)
];

// منتجات متجر ماجنا بيوتي (ID: 5)
export const magnaBeautyProducts: RealProduct[] = [
  // ... (magna products)
];

// دمج جميع المنتجات
export const allRealStoreProducts: RealProduct[] = [
  ...sheirineProducts,
  ...assetsProducts,
  ...prettyProducts,
  ...deltaStoreProducts,
  ...magnaBeautyProducts
];
