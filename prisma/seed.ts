import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/es';
import {
  SeedUser,
  SeedMovie,
  SeedGenre,
  SeedReview,
  SeedStreamingPlatform,
} from './types';

const prisma = new PrismaClient();

async function main() {
  await seedDatabase();
}

async function seedDatabase() {
  console.log('🌱 Iniciando seeding...');

  // Limpiar la base de datos primero (opcional)
  await cleanDatabase();

  // Crear datos en orden para mantener las relaciones
  const users: SeedUser[] = await createUsers(50);
  const genres: SeedGenre[] = await createGenres();
  const movies: SeedMovie[] = await createMovies(100);
  await createMovieGenres(movies, genres);
  await createFollowers(users);
  await createReviews(users, movies);
  await createMovieLists(users, movies);
  const platforms: SeedStreamingPlatform[] = await createStreamingPlatforms();
  await createStreamingAvailability(movies, platforms);
  await createUserPreferences(users, genres);
  await createRecommendations(users, movies);
  await createNotifications(users);
  await createViewingHistory(users, movies);

  console.log('✅ Seeding completado!');
}

async function cleanDatabase() {
  // Eliminar datos existentes respetando las restricciones de clave foránea
  await prisma.viewingHistory.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.movieRecommendation.deleteMany({});
  await prisma.userPreference.deleteMany({});
  await prisma.movieStreamingAvailability.deleteMany({});
  await prisma.streamingPlatform.deleteMany({});
  await prisma.movieListItem.deleteMany({});
  await prisma.movieList.deleteMany({});
  await prisma.reviewComment.deleteMany({});
  await prisma.reviewLike.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.movieGenre.deleteMany({});
  await prisma.genre.deleteMany({});
  await prisma.movie.deleteMany({});
  await prisma.follower.deleteMany({});
  await prisma.user.deleteMany({});
}

async function createUsers(count: number): Promise<SeedUser[]> {
  console.log(`Creando ${count} usuarios...`);

  const users = [];

  for (let i = 0; i < count; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        passwordHash: faker.internet.password(),
        username: faker.internet
          .username()
          .toLowerCase()
          .replace(/[^a-z0-9_]/gi, '_'),
        profilePicture: faker.image.avatar(),
        biography: faker.lorem.paragraph(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        lastLogin: faker.date.recent(),
      },
    });
    users.push(user);
  }

  return users;
}

async function createGenres(): Promise<SeedGenre[]> {
  console.log('Creando géneros...');

  const genreNames = [
    'Terror',
    'Ciencia Ficción',
    'Drama',
    'Comedia',
    'Acción',
    'Aventura',
    'Fantasía',
    'Suspense',
    'Misterio',
    'Romance',
    'Animación',
    'Documental',
    'Biografía',
    'Musical',
    'Western',
    'Histórico',
    'Guerra',
    'Experimental',
    'Psicológico',
    'Gore',
  ];

  const genres = [];

  for (const name of genreNames) {
    const genre = await prisma.genre.create({
      data: {
        name,
        description: faker.lorem.paragraph(),
      },
    });
    genres.push(genre);
  }

  return genres;
}

async function createMovies(count: number): Promise<SeedMovie[]> {
  console.log(`Creando ${count} películas...`);

  const cultDirectors = [
    'David Lynch',
    'Alejandro Jodorowsky',
    'John Waters',
    'David Cronenberg',
    'John Carpenter',
    'Dario Argento',
    'Takashi Miike',
    'Lars von Trier',
    'Gaspar Noé',
    'Park Chan-wook',
    'Andrzej Żuławski',
    'Harmony Korine',
    'Kenneth Anger',
    'Jim Jarmusch',
    'Werner Herzog',
    'Terry Gilliam',
  ];

  const movies = [];

  for (let i = 0; i < count; i++) {
    const isCult = faker.datatype.boolean(0.4); // 40% de probabilidad
    const isUnderground = faker.datatype.boolean(0.3); // 30% de probabilidad

    const movie = await prisma.movie.create({
      data: {
        title: faker.lorem.words(3),
        originalTitle: faker.datatype.boolean(0.3)
          ? faker.lorem.words(3)
          : null,
        releaseYear: faker.number.int({ min: 1950, max: 2023 }),
        synopsis: faker.lorem.paragraph(),
        director: faker.helpers.arrayElement(cultDirectors),
        posterImage: `https://picsum.photos/seed/${faker.string.uuid()}/300/450`,
        backdropImage: `https://picsum.photos/seed/${faker.string.uuid()}/1280/720`,
        duration: faker.number.int({ min: 75, max: 180 }),
        isCult,
        isUnderground,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      },
    });

    movies.push(movie);
  }

  return movies;
}

async function createMovieGenres(movies: SeedMovie[], genres: SeedGenre[]) {
  console.log('Asignando géneros a películas...');

  for (const movie of movies) {
    // Asignar entre 1 y 3 géneros aleatorios a cada película
    const genreCount = faker.number.int({ min: 1, max: 3 });
    const shuffledGenres = [...genres].sort(() => 0.5 - Math.random());
    const selectedGenres = shuffledGenres.slice(0, genreCount);

    for (const genre of selectedGenres) {
      await prisma.movieGenre.create({
        data: {
          movieId: movie.id,
          genreId: genre.id,
        },
      });
    }
  }
}

async function createFollowers(users: SeedUser[]) {
  console.log('Creando relaciones de seguidores...');

  // Cada usuario seguirá a entre 0 y 10 usuarios aleatorios
  for (const user of users) {
    const followCount = faker.number.int({ min: 0, max: 10 });
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
    const usersToFollow = shuffledUsers
      .slice(0, followCount)
      .filter((u) => u.id !== user.id);

    for (const userToFollow of usersToFollow) {
      try {
        await prisma.follower.create({
          data: {
            followerId: user.id,
            followedId: userToFollow.id,
            createdAt: faker.date.recent(),
          },
        });
      } catch (error) {
        // Ignorar errores de unicidad si ya existe la relación
      }
    }
  }
}

async function createReviews(users: SeedUser[], movies: SeedMovie[]) {
  console.log('Creando reseñas...');

  // Aproximadamente el 30% de los usuarios crearán reseñas
  const reviewingUsers = users.filter(() => faker.datatype.boolean(0.3));

  for (const user of reviewingUsers) {
    // Cada usuario reseñará entre 1 y 5 películas
    const reviewCount = faker.number.int({ min: 1, max: 5 });
    const shuffledMovies = [...movies].sort(() => 0.5 - Math.random());
    const moviesToReview = shuffledMovies.slice(0, reviewCount);

    for (const movie of moviesToReview) {
      try {
        const review = await prisma.review.create({
          data: {
            userId: user.id,
            movieId: movie.id,
            rating: faker.number.int({ min: 1, max: 5 }),
            content: faker.lorem.paragraphs(),
            createdAt: faker.date.past(),
            updatedAt: faker.date.recent(),
            likesCount: 0, // Se actualizará después
          },
        });

        // Crear likes para esta reseña
        await createReviewLikes(review, users);

        // Crear comentarios para esta reseña
        await createReviewComments(review, users);
      } catch (error) {
        // Ignorar errores de unicidad
      }
    }
  }
}

async function createReviewLikes(review: SeedReview, users: SeedUser[]) {
  // Entre 0 y 15 usuarios darán like a esta reseña
  const likeCount = faker.number.int({ min: 0, max: 15 });
  const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
  const usersToLike = shuffledUsers.slice(0, likeCount);

  let actualLikes = 0;

  for (const user of usersToLike) {
    try {
      await prisma.reviewLike.create({
        data: {
          userId: user.id,
          reviewId: review.id,
          createdAt: faker.date.recent(),
        },
      });
      actualLikes++;
    } catch (error) {
      // Ignorar errores de unicidad
    }
  }

  // Actualizar el contador de likes
  if (actualLikes > 0) {
    await prisma.review.update({
      where: { id: review.id },
      data: { likesCount: actualLikes },
    });
  }
}

async function createReviewComments(review: SeedReview, users: SeedUser[]) {
  // Entre 0 y 5 comentarios por reseña
  const commentCount = faker.number.int({ min: 0, max: 5 });
  const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
  const usersToComment = shuffledUsers.slice(0, commentCount);

  for (const user of usersToComment) {
    await prisma.reviewComment.create({
      data: {
        reviewId: review.id,
        userId: user.id,
        content: faker.lorem.paragraph(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      },
    });
  }
}

async function createMovieLists(users: SeedUser[], movies: SeedMovie[]) {
  console.log('Creando listas de películas...');

  const listNames = [
    'Mis favoritas',
    'Para ver',
    'Películas de culto esenciales',
    'Cine experimental',
    'Joyas ocultas',
    'Lo mejor de los 80s',
    'Directores visionarios',
    'Terror psicológico',
    'Cine asiático',
    'Clásicos del underground',
  ];

  // El 40% de los usuarios crearán listas
  const listingUsers = users.filter(() => faker.datatype.boolean(0.4));

  for (const user of listingUsers) {
    // Cada usuario creará entre 1 y 3 listas
    const listCount = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < listCount; i++) {
      const listName = faker.helpers.arrayElement(listNames);

      const list = await prisma.movieList.create({
        data: {
          userId: user.id,
          name: `${listName} de ${user.username}`,
          description: faker.lorem.paragraph(),
          isPublic: faker.datatype.boolean(0.8), // 80% serán públicas
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent(),
        },
      });

      // Añadir entre 3 y 15 películas a la lista
      const movieCount = faker.number.int({ min: 3, max: 15 });
      const shuffledMovies = [...movies].sort(() => 0.5 - Math.random());
      const moviesToAdd = shuffledMovies.slice(0, movieCount);

      for (const movie of moviesToAdd) {
        try {
          await prisma.movieListItem.create({
            data: {
              listId: list.id,
              movieId: movie.id,
              addedAt: faker.date.recent(),
              notes: faker.datatype.boolean(0.3)
                ? faker.lorem.sentence()
                : null,
            },
          });
        } catch (error) {
          // Ignorar errores de unicidad
        }
      }
    }
  }
}

async function createStreamingPlatforms(): Promise<SeedStreamingPlatform[]> {
  console.log('Creando plataformas de streaming...');

  const platforms = [
    {
      name: 'Netflix',
      logo: 'https://brandlogos.net/wp-content/uploads/2020/03/Netflix-logo-Symbol-512x512.png',
      website: 'https://www.netflix.com',
    },
    {
      name: 'Amazon Prime Video',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Amazon_Prime_Video_logo_%282024%29.svg/2048px-Amazon_Prime_Video_logo_%282024%29.svg.png',
      website: 'https://www.primevideo.com',
    },
    {
      name: 'Disney+',
      logo: 'https://www.infobae.com/resizer/v2/5EGT4P4UKRGAZPDR52FKJJW4YU.png?auth=3f125fa705ecf609ace87748760c3db6cf4bd6675e527fc2ad236efb50c5c6d2&smart=true&width=1200&height=900&quality=85',
      website: 'https://www.disneyplus.com',
    },
    {
      name: 'HBO Max',
      logo: 'https://i0.wp.com/elpoderdelasideas.com/wp-content/uploads/HBO-Max-logo-2019-elpoderdelasideas3.png?fit=800%2C533&ssl=1',
      website: 'https://www.hbomax.com',
    },
  ];

  const createdPlatforms = [];

  for (const platform of platforms) {
    const createdPlatform = await prisma.streamingPlatform.create({
      data: {
        name: platform.name,
        logoUrl: platform.logo,
        websiteUrl: platform.website,
      },
    });
    createdPlatforms.push(createdPlatform);
  }

  return createdPlatforms;
}

async function createStreamingAvailability(
  movies: SeedMovie[],
  platforms: SeedStreamingPlatform[]
) {
  console.log('Creando disponibilidad en plataformas...');

  for (const movie of movies) {
    // Cada película estará disponible en 0-3 plataformas
    const platformCount = faker.number.int({ min: 0, max: 3 });
    const shuffledPlatforms = [...platforms].sort(() => 0.5 - Math.random());
    const selectedPlatforms = shuffledPlatforms.slice(0, platformCount);

    for (const platform of selectedPlatforms) {
      try {
        await prisma.movieStreamingAvailability.create({
          data: {
            movieId: movie.id,
            platformId: platform.id,
            url: `${platform.websiteUrl}/watch/${faker.string.alphanumeric(8)}`,
            addedAt: faker.date.recent(),
            updatedAt: faker.date.recent(),
          },
        });
      } catch (error) {
        // Ignorar errores de unicidad
      }
    }
  }
}

async function createUserPreferences(users: SeedUser[], genres: SeedGenre[]) {
  console.log('Creando preferencias de usuarios...');

  // El 60% de los usuarios tendrán preferencias establecidas
  const usersWithPreferences = users.filter(() => faker.datatype.boolean(0.6));

  for (const user of usersWithPreferences) {
    // Seleccionar géneros preferidos (2-5)
    const preferredCount = faker.number.int({ min: 2, max: 5 });
    const shuffledGenres = [...genres].sort(() => 0.5 - Math.random());
    const preferredGenres = shuffledGenres
      .slice(0, preferredCount)
      .map((g) => g.name);

    // Seleccionar géneros no preferidos (0-3)
    const dislikedCount = faker.number.int({ min: 0, max: 3 });
    const remainingGenres = shuffledGenres.slice(preferredCount);
    const dislikedGenres = remainingGenres
      .slice(0, dislikedCount)
      .map((g) => g.name);

    // Directores favoritos (0-5)
    const directors = [
      'David Lynch',
      'Alejandro Jodorowsky',
      'John Waters',
      'David Cronenberg',
      'John Carpenter',
      'Dario Argento',
      'Takashi Miike',
      'Lars von Trier',
      'Gaspar Noé',
      'Park Chan-wook',
      'Andrzej Żuławski',
      'Harmony Korine',
    ];
    const directorCount = faker.number.int({ min: 0, max: 5 });
    const favoriteDirectors = faker.helpers.arrayElements(
      directors,
      directorCount
    );

    // Décadas preferidas
    const decades = ['1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];
    const decadeCount = faker.number.int({ min: 1, max: 3 });
    const preferredDecades = faker.helpers.arrayElements(decades, decadeCount);

    await prisma.userPreference.create({
      data: {
        userId: user.id,
        preferredGenres,
        dislikedGenres,
        favoriteDirectors,
        preferredDecades,
        updatedAt: faker.date.recent(),
      },
    });
  }
}

async function createRecommendations(users: SeedUser[], movies: SeedMovie[]) {
  console.log('Creando recomendaciones de películas...');

  for (const user of users) {
    // Cada usuario tendrá entre 3 y 10 recomendaciones
    const recommendationCount = faker.number.int({ min: 3, max: 10 });
    const shuffledMovies = [...movies].sort(() => 0.5 - Math.random());
    const moviesToRecommend = shuffledMovies.slice(0, recommendationCount);

    for (const movie of moviesToRecommend) {
      try {
        const reasons = [
          'Basado en tus gustos',
          'Porque te gusta este director',
          'Popular entre usuarios similares',
          'Basado en tus géneros favoritos',
          'Porque has visto películas similares',
          'Recomendada por la crítica',
        ];

        await prisma.movieRecommendation.create({
          data: {
            userId: user.id,
            movieId: movie.id,
            score: faker.number.float({ min: 0.5, max: 1.0, fractionDigits: 2 }),
            reason: faker.helpers.arrayElement(reasons),
            createdAt: faker.date.recent(),
            isViewed: faker.datatype.boolean(0.3), // 30% ya vistas
          },
        });
      } catch (error) {
        // Ignorar errores de unicidad
      }
    }
  }
}

async function createNotifications(users: SeedUser[]) {
  console.log('Creando notificaciones...');

  const notificationTypes = [
    'new_follower',
    'review_like',
    'review_comment',
    'movie_recommendation',
    'system_announcement',
    'list_mentioned',
  ];

  for (const user of users) {
    // Cada usuario tendrá entre 0 y 15 notificaciones
    const notificationCount = faker.number.int({ min: 0, max: 15 });

    for (let i = 0; i < notificationCount; i++) {
      const type = faker.helpers.arrayElement(notificationTypes);
      let content = '';

      switch (type) {
        case 'new_follower':
          content = `${faker.person.fullName()} ha comenzado a seguirte`;
          break;
        case 'review_like':
          content = `A ${faker.person.fullName()} le gustó tu reseña de "${faker.lorem.words(
            3
          )}"`;
          break;
        case 'review_comment':
          content = `${faker.person.fullName()} comentó en tu reseña`;
          break;
        case 'movie_recommendation':
          content = `Tenemos una nueva recomendación para ti: "${faker.lorem.words(
            3
          )}"`;
          break;
        case 'system_announcement':
          content = `¡Nueva función disponible! ${faker.lorem.sentence()}`;
          break;
        case 'list_mentioned':
          content = `${faker.person.fullName()} mencionó tu lista "${faker.lorem.words(
            3
          )}"`;
          break;
      }

      await prisma.notification.create({
        data: {
          userId: user.id,
          type,
          content,
          referenceId: null, // En un caso real, pondríamos IDs de referencia adecuados
          isRead: faker.datatype.boolean(0.5), // 50% leídas
          createdAt: faker.date.recent(),
        },
      });
    }
  }
}

async function createViewingHistory(users: SeedUser[], movies: SeedMovie[]) {
  console.log('Creando historial de visualización...');

  for (const user of users) {
    // Cada usuario habrá visto entre 5 y 20 películas
    const viewCount = faker.number.int({ min: 5, max: 20 });
    const shuffledMovies = [...movies].sort(() => 0.5 - Math.random());
    const viewedMovies = shuffledMovies.slice(0, viewCount);

    for (const movie of viewedMovies) {
      try {
        await prisma.viewingHistory.create({
          data: {
            userId: user.id,
            movieId: movie.id,
            viewedAt: faker.date.past(),
          },
        });
      } catch (error) {
        // Ignorar errores de unicidad
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
