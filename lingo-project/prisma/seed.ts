import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  // Удаление данных в правильном порядке (с учетом foreign key constraints)
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.eventImage.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.town.deleteMany();
  await prisma.status.deleteMany();

  // Создаем статусы событий
  await prisma.status.createMany({
    data: [
      { name: "На проверке" },
      { name: "Предстоящее" },
      { name: "Общение участников" },
      { name: "Завершенное" },
      { name: "Отмененное" },
    ],
  });

  // Создаем категории с картинками
  await prisma.category.createMany({
    data: [
      { name: "Концерт", image: "concert.svg" },
      { name: "Выставка", image: "exhibition.svg" },
      { name: "Фестиваль", image: "festival.svg" },
      { name: "Спорт", image: "sport.svg" },
      { name: "Театр", image: "theater.svg" },
      { name: "Кино", image: "cinema.svg" },
      { name: "Образование", image: "education.svg" },
      {
        name: "Еда и напитки",
        image: "food-and-drinks.svg",
      },
      { name: "Кулинария", image: "culinary.svg" },
      { name: "Туризм", image: "tourism.svg" },
      { name: "Мода", image: "fashion.svg" },
      { name: "Бизнес", image: "business.svg" },
    ],
  });

  // Создаем города
  await prisma.town.createMany({
    data: [
      { name: "Москва" },
      { name: "Санкт-Петербург" },
      { name: "Новосибирск" },
      { name: "Екатеринбург" },
      { name: "Казань" },
    ],
  });

  // Создаем тестовых пользователей
  const [admin, organizer, user] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Администратор",
        email: "admin@example.com",
        password: hashSync("admin11", 10),
        role: "ADMIN",
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Организатор",
        email: "organizer@example.com",
        password: hashSync("pols11", 10),
        role: "ORGANIZER",
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Пользователь",
        email: "user@example.com",
        password: "$2a$10$X8L9.3XvJzZrF.5jZ5W4E.XxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
        role: "USER",
        emailVerified: new Date(),
      },
    }),
  ]);

  // Получаем объекты для связей
  const [
    upcomingStatus,
    concertCategory,
    exhibitionCategory,
    festivalCategory,
    sportsCategory,
    theaterCategory,
    cinemaCategory,
    foodCategory,
    educationCategory,
    culinaryCategory,
    tourismCategory,
    fashionCategory,
    businessCategory,
    moscowTown,
    spbTown,
  ] = await Promise.all([
    prisma.status.findFirstOrThrow({ where: { name: "Предстоящее" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Концерт" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Выставка" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Фестиваль" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Спорт" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Театр" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Кино" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Еда и напитки" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Образование" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Кулинария" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Туризм" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Мода" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Бизнес" } }),
    prisma.town.findFirstOrThrow({ where: { name: "Москва" } }),
    prisma.town.findFirstOrThrow({ where: { name: "Санкт-Петербург" } }),
  ]);

  // Создаем события без картинок
  await prisma.event.createMany({
    data: [
      {
        title: "Рок концерт",
        description: `
        ### Описание события:
        Присоединяйтесь к нашему рок-концерту, который подарит вам море эмоций и незабываемую атмосферу живой музыки. Знаменитые рок-группы будут исполнять хиты, которые уже давно стали классикой.

        ### Дополнительная информация:
        - Место проведения: Стадион Лужники.
        - Время начала: 19:00.
        - Продолжительность: 180 минут.
        - Возрастное ограничение: 16+.
        `,
        startDate: new Date("2023-12-15"),
        startTime: "19:00",
        duration: 180,
        age: 16,
        place: "Стадион Лужники",
        createdById: organizer.id,
        categoryId: concertCategory.id,
        townId: spbTown.id,
        statusId: upcomingStatus.id,
      },
      {
        title: "Джазовый вечер",
        description: `
        ### Описание события:
        Наслаждайтесь вечерней атмосферой джазового вечера в нашем уютном кафе. Погрузитесь в мир изысканной музыки и получайте удовольствие от живых выступлений джазовых исполнителей.

        ### Дополнительная информация:
        - Место проведения: Джаз кафе.
        - Время начала: 20:00.
        - Продолжительность: 120 минут.
        - Возрастное ограничение: 18+.
        `,
        startDate: new Date("2023-12-20"),
        startTime: "20:00",
        duration: 120,
        age: 18,
        place: "Джаз кафе",
        createdById: organizer.id,
        categoryId: concertCategory.id,
        townId: spbTown.id,
        statusId: upcomingStatus.id,
      },
      {
        title: "Международная выставка искусства",
        description: `
        ### Описание события:
        Выставка современного искусства с участием мастеров со всего мира. Вечер будет включать в себя лекции, мастер-классы, а также экспозиции лучших произведений искусства.

        ### Дополнительная информация:
        - Место проведения: Московский выставочный центр.
        - Время начала: 10:00.
        - Продолжительность: 240 минут.
        - Возрастное ограничение: Без ограничений.
        `,
        startDate: new Date("2023-12-25"),
        startTime: "10:00",
        duration: 240,
        age: 0,
        place: "Московский выставочный центр",
        createdById: organizer.id,
        categoryId: exhibitionCategory.id,
        townId: spbTown.id,
        statusId: upcomingStatus.id,
      },
      {
        title: "Фотовыставка",
        description: `
        ### Описание события:
        Выставка фотографий, где представлены работы как начинающих, так и опытных фотографов. Ожидайте много уникальных работ, которые раскрывают различные подходы в фотографии.

        ### Дополнительная информация:
        - Место проведения: Центральный выставочный зал.
        - Время начала: 11:00.
        - Продолжительность: 180 минут.
        - Возрастное ограничение: Без ограничений.
        `,
        startDate: new Date("2024-01-10"),
        startTime: "11:00",
        duration: 180,
        age: 0,
        place: "Центральный выставочный зал",
        createdById: organizer.id,
        categoryId: exhibitionCategory.id,
        townId: spbTown.id,
        statusId: upcomingStatus.id,
      },
      {
        title: "Фестиваль уличной еды",
        description: "Фестиваль с участием лучших уличных поваров.",
        startDate: new Date("2024-01-05"),
        startTime: "12:00",
        duration: 180,
        age: 0,
        place: "Центральный парк",
        createdById: organizer.id,
        categoryId: festivalCategory.id,
        townId: moscowTown.id,
        statusId: upcomingStatus.id,
      },
      {
        title: "Фестиваль музыки и танцев",
        description: "Танцевальные и музыкальные номера на улице.",
        startDate: new Date("2024-01-12"),
        startTime: "14:00",
        duration: 150,
        age: 0,
        place: "Открытая площадка в парке",
        createdById: organizer.id,
        categoryId: festivalCategory.id,
        townId: spbTown.id,
        statusId: upcomingStatus.id,
      },
      {
        title: "Матч по футболу",
        description: "Матч чемпионата страны по футболу.",
        startDate: new Date("2024-01-20"),
        startTime: "19:00",
        duration: 120,
        age: 0,
        place: "Стадион Спартак",
        createdById: organizer.id,
        categoryId: sportsCategory.id,
        townId: moscowTown.id,
        statusId: upcomingStatus.id,
      },
      {
        title: "Марафон",
        description: "Городской марафон для всех желающих.",
        startDate: new Date("2024-01-25"),
        startTime: "09:00",
        duration: 240,
        age: 0,
        place: "Центр города",
        createdById: organizer.id,
        categoryId: sportsCategory.id,
        townId: spbTown.id,
        statusId: upcomingStatus.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
