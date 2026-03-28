export type Lang = 'EN' | 'AZ' | 'RU'

const translations = {
  EN: {
    nav: {
      discover:  'Discover',
      blog:      'Blog',
      pricing:   'Pricing',
      features:  'Features',
      about:     'About',
      messages:  'Messages',
      dashboard: 'Dashboard',
      login:     'Log in',
      signup:    'Start selling',
      logout:    'Log out',
    },
    hero: {
      badge:    'Built in Azerbaijan · For the world',
      h1a:      'Buy & sell',
      h1b:      'IT projects',
      h1c:      'instantly.',
      sub:      'The marketplace where developers sell ready-to-deploy websites, apps, SaaS tools, and scripts. Full source code. One-time payment. Real escrow.',
      browse:   'Browse projects',
      sell:     'Start selling',
    },
    stats: {
      projects:     'Projects listed',
      sellers:      'Verified sellers',
      paid:         'Paid to sellers',
      satisfaction: 'Buyer satisfaction',
    },
    footer: {
      tagline: 'Made in Azerbaijan',
      rights:  'All rights reserved.',
    },
    dashboard: {
      overview:    'Overview',
      myProjects:  'My Projects',
      newListing:  'New Listing',
      purchases:   'My Purchases',
      saved:       'Saved',
      browse:      'Browse',
      marketplace: 'Marketplace',
      logout:      'Log out',
    },
  },

  AZ: {
    nav: {
      discover:  'Kəşfet',
      blog:      'Blog',
      pricing:   'Qiymətlər',
      features:  'Xüsusiyyətlər',
      about:     'Haqqında',
      messages:  'Mesajlar',
      dashboard: 'Panel',
      login:     'Giriş',
      signup:    'Satışa Başla',
      logout:    'Çıxış',
    },
    hero: {
      badge:    'Azərbaycanda yaradılıb · Dünya üçün',
      h1a:      'IT layihələri',
      h1b:      'al & sat',
      h1c:      'dərhal.',
      sub:      'Hazır deploy edilə bilən saytlar, tətbiqlər, SaaS alətlər və skriptlər satan developerlər bazarı. Tam mənbə kodu. Birdəfəlik ödəniş. Real eskrou.',
      browse:   'Layihələrə bax',
      sell:     'Satışa Başla',
    },
    stats: {
      projects:     'Siyahıya alınmış layihə',
      sellers:      'Təsdiqlənmiş satıcı',
      paid:         'Satıcılara ödənildi',
      satisfaction: 'Alıcı məmnuniyyəti',
    },
    footer: {
      tagline: 'Azərbaycanda hazırlanıb',
      rights:  'Bütün hüquqlar qorunur.',
    },
    dashboard: {
      overview:    'Ümumi baxış',
      myProjects:  'Layihələrim',
      newListing:  'Yeni elan',
      purchases:   'Alışlarım',
      saved:       'Saxlanılmış',
      browse:      'Axtar',
      marketplace: 'Bazar',
      logout:      'Çıxış',
    },
  },

  RU: {
    nav: {
      discover:  'Обзор',
      blog:      'Блог',
      pricing:   'Цены',
      features:  'Функции',
      about:     'О нас',
      messages:  'Сообщения',
      dashboard: 'Панель',
      login:     'Войти',
      signup:    'Начать продавать',
      logout:    'Выйти',
    },
    hero: {
      badge:    'Создано в Азербайджане · Для всего мира',
      h1a:      'Покупайте и',
      h1b:      'продавайте IT',
      h1c:      'мгновенно.',
      sub:      'Маркетплейс, где разработчики продают готовые сайты, приложения, SaaS-инструменты и скрипты. Полный исходный код. Разовая оплата. Реальный эскроу.',
      browse:   'Смотреть проекты',
      sell:     'Начать продавать',
    },
    stats: {
      projects:     'Проектов добавлено',
      sellers:      'Верифицированных продавцов',
      paid:         'Выплачено продавцам',
      satisfaction: 'Довольных покупателей',
    },
    footer: {
      tagline: 'Сделано в Азербайджане',
      rights:  'Все права защищены.',
    },
    dashboard: {
      overview:    'Обзор',
      myProjects:  'Мои проекты',
      newListing:  'Новый листинг',
      purchases:   'Мои покупки',
      saved:       'Сохранённые',
      browse:      'Обзор',
      marketplace: 'Маркетплейс',
      logout:      'Выйти',
    },
  },
} as const

export type Translations = typeof translations.EN
export { translations }
