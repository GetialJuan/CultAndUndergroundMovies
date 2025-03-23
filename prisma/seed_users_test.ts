import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/es';
import {
  SeedUser,
  SeedMovie,
  SeedGenre,
  SeedReview,
  SeedStreamingPlatform,
} from './types';
import * as bcrypt from 'bcrypt'; // Importamos bcrypt para el hasheo

const prisma = new PrismaClient();

// Función para hashear contraseñas
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Test user credentials that will be created
const TEST_USERS = [
  { username: 'test_user1', email: 'test1@example.com', password: 'password1' },
  { username: 'test_user2', email: 'test2@example.com', password: 'password2' },
  { username: 'test_user3', email: 'test3@example.com', password: 'password3' },
  { username: 'test_user4', email: 'test4@example.com', password: 'password4' },
  { username: 'test_user5', email: 'test5@example.com', password: 'password5' },
  { username: 'admin_test', email: 'admin@example.com', password: 'admin123' },
  {
    username: 'critic_test',
    email: 'critic@example.com',
    password: 'critic123',
  },
  {
    username: 'casual_fan',
    email: 'casual@example.com',
    password: 'casual123',
  },
  { username: 'movie_buff', email: 'buff@example.com', password: 'buff123' },
  {
    username: 'horror_fan',
    email: 'horror@example.com',
    password: 'horror123',
  },
];

async function main() {
  console.log('🌱 Iniciando seed2 para usuarios de prueba...');

  // Primero, actualiza usuarios existentes que tengan contraseñas en texto plano
  await updateExistingUsersPasswords();

  // Create test users
  const testUsers = await createTestUsers();

  // Get existing data from database
  const existingUsers = await prisma.user.findMany({
    where: {
      NOT: {
        id: {
          in: testUsers.map((user) => user.id),
        },
      },
    },
    take: 20, // Limit to 20 users for interactions
  });

  const movies = await prisma.movie.findMany({
    take: 30, // Limit to 30 movies for interactions
  });

  const genres = await prisma.genre.findMany();
  const platforms = await prisma.streamingPlatform.findMany();

  // Create interactions for test users
  await createFollowers(testUsers, existingUsers);
  await createReviews(testUsers, movies);
  await createMovieLists(testUsers, movies);
  await createUserPreferences(testUsers, genres);
  await createViewingHistory(testUsers, movies);
  await createRecommendations(testUsers, movies);
  await createNotifications(testUsers);

  console.log('✅ Seed2 completado! Usuarios de prueba creados.');
  console.log('🔑 Credenciales de usuarios de prueba:');
  TEST_USERS.forEach((user) => {
    console.log(
      `- Usuario: ${user.username}, Email: ${user.email}, Contraseña: ${user.password}`
    );
  });
}

// Función para actualizar las contraseñas de usuarios existentes
async function updateExistingUsersPasswords() {
  console.log('Verificando si hay usuarios con contraseñas sin hashear...');

  for (const userData of TEST_USERS) {
    const user = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (user) {
      // Verificamos si la contraseña parece estar en texto plano
      // (si es igual a la contraseña original, necesita ser hasheada)
      if (user.passwordHash === userData.password) {
        console.log(
          `Actualizando contraseña hasheada para ${userData.email}...`
        );
        const hashedPassword = await hashPassword(userData.password);

        await prisma.user.update({
          where: { email: userData.email },
          data: { passwordHash: hashedPassword },
        });

        console.log(`✓ Contraseña actualizada para ${userData.email}`);
      } else {
        console.log(
          `La contraseña de ${userData.email} ya parece estar hasheada, omitiendo...`
        );
      }
    }
  }
}

async function createTestUsers(): Promise<SeedUser[]> {
  const createdUsers: SeedUser[] = [];

  for (const userData of TEST_USERS) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log(`Usuario ${userData.email} ya existe, omitiendo...`);
      createdUsers.push(existingUser as SeedUser);
      continue;
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await hashPassword(userData.password);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        passwordHash: hashedPassword, // Ahora guardamos el hash, no el texto plano
        username: userData.username,
        profilePicture: faker.image.avatar(),
        biography: faker.lorem.paragraph(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        lastLogin: faker.date.recent(),
      },
    });

    console.log(`Creado usuario de prueba: ${user.username}`);
    createdUsers.push(user as SeedUser);
  }

  return createdUsers;
}

async function createFollowers(testUsers: SeedUser[], existingUsers: any[]) {
  console.log('Creando relaciones de seguidores para usuarios de prueba...');

  // Each test user follows some existing users
  for (const testUser of testUsers) {
    // Follow 3-8 existing users
    const followCount = faker.number.int({ min: 3, max: 8 });
    const usersToFollow = faker.helpers.arrayElements(
      existingUsers,
      followCount
    );

    for (const userToFollow of usersToFollow) {
      try {
        await prisma.follower.create({
          data: {
            followerId: testUser.id,
            followedId: userToFollow.id,
            createdAt: faker.date.recent(),
          },
        });
      } catch (error) {
        // Ignore duplicate relations
      }
    }
  }

  // Some existing users follow test users
  for (const existingUser of existingUsers.slice(0, 10)) {
    // Follow 1-5 test users
    const followCount = faker.number.int({ min: 1, max: 5 });
    const testUsersToFollow = faker.helpers.arrayElements(
      testUsers,
      followCount
    );

    for (const testUserToFollow of testUsersToFollow) {
      try {
        await prisma.follower.create({
          data: {
            followerId: existingUser.id,
            followedId: testUserToFollow.id,
            createdAt: faker.date.recent(),
          },
        });
      } catch (error) {
        // Ignore duplicate relations
      }
    }
  }

  // Test users follow each other
  for (const testUser of testUsers) {
    const otherTestUsers = testUsers.filter((u) => u.id !== testUser.id);
    const followCount = faker.number.int({ min: 1, max: 5 });
    const testUsersToFollow = faker.helpers.arrayElements(
      otherTestUsers,
      followCount
    );

    for (const testUserToFollow of testUsersToFollow) {
      try {
        await prisma.follower.create({
          data: {
            followerId: testUser.id,
            followedId: testUserToFollow.id,
            createdAt: faker.date.recent(),
          },
        });
      } catch (error) {
        // Ignore duplicate relations
      }
    }
  }
}

async function createReviews(testUsers: SeedUser[], movies: SeedMovie[]) {
  console.log('Creando reseñas para usuarios de prueba...');

  for (const user of testUsers) {
    // Each user reviews 3-8 movies
    const reviewCount = faker.number.int({ min: 3, max: 8 });
    const moviesToReview = faker.helpers.arrayElements(movies, reviewCount);

    for (const movie of moviesToReview) {
      try {
        const review = await prisma.review.create({
          data: {
            userId: user.id,
            movieId: movie.id,
            rating: faker.number.int({ min: 1, max: 5 }),
            content: faker.lorem.paragraphs(2),
            createdAt: faker.date.past(),
            updatedAt: faker.date.recent(),
            likesCount: 0, // Will be updated later
          },
        });

        // Create likes from other test users for this review
        await createReviewLikes(
          review as SeedReview,
          testUsers.filter((u) => u.id !== user.id)
        );

        // Create comments from other test users
        await createReviewComments(
          review as SeedReview,
          testUsers.filter((u) => u.id !== user.id)
        );
      } catch (error) {
        // Ignore duplicates
      }
    }
  }

  // Test users also like and comment on existing reviews
  const existingReviews = await prisma.review.findMany({
    where: {
      NOT: {
        userId: {
          in: testUsers.map((user) => user.id),
        },
      },
    },
    take: 20,
  });

  for (const review of existingReviews) {
    await createReviewLikes(
      review as SeedReview,
      faker.helpers.arrayElements(
        testUsers,
        faker.number.int({ min: 1, max: 5 })
      )
    );
    await createReviewComments(
      review as SeedReview,
      faker.helpers.arrayElements(
        testUsers,
        faker.number.int({ min: 0, max: 3 })
      )
    );
  }
}

async function createReviewLikes(review: SeedReview, users: SeedUser[]) {
  let actualLikes = 0;

  for (const user of users) {
    if (faker.datatype.boolean(0.7)) {
      // 70% chance to like
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
        // Ignore duplicates
      }
    }
  }

  // Update likes count
  if (actualLikes > 0) {
    await prisma.review.update({
      where: { id: review.id },
      data: {
        likesCount: {
          increment: actualLikes,
        },
      },
    });
  }
}

async function createReviewComments(review: SeedReview, users: SeedUser[]) {
  for (const user of users) {
    if (faker.datatype.boolean(0.4)) {
      // 40% chance to comment
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
}

async function createMovieLists(testUsers: SeedUser[], movies: SeedMovie[]) {
  console.log('Creando listas de películas para usuarios de prueba...');

  const listNames = [
    'Películas favoritas',
    'Pendientes de ver',
    'Culto imprescindible',
    'Lo mejor del terror',
    'Películas infravaloradas',
    'Joyas experimentales',
    'Mejores del año',
    'Directores visionarios',
    'Obras maestras',
    'Descubrimientos recientes',
  ];

  for (const user of testUsers) {
    // Each user creates 1-3 lists
    const listCount = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < listCount; i++) {
      const listName = faker.helpers.arrayElement(listNames);

      const list = await prisma.movieList.create({
        data: {
          userId: user.id,
          name: `${listName} de ${user.username}`,
          description: faker.lorem.paragraph(),
          isPublic: faker.datatype.boolean(0.8), // 80% public
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent(),
        },
      });

      // Add 4-12 movies to the list
      const movieCount = faker.number.int({ min: 4, max: 12 });
      const moviesToAdd = faker.helpers.arrayElements(movies, movieCount);

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
          // Ignore duplicates
        }
      }
    }
  }
}

async function createUserPreferences(
  testUsers: SeedUser[],
  genres: SeedGenre[]
) {
  console.log('Creando preferencias para usuarios de prueba...');

  // Define directors
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
  ];

  // Define decades
  const decades = ['1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

  for (const user of testUsers) {
    // Select preferred genres (2-5)
    const preferredCount = faker.number.int({ min: 2, max: 5 });
    const shuffledGenres = [...genres].sort(() => 0.5 - Math.random());
    const preferredGenres = shuffledGenres
      .slice(0, preferredCount)
      .map((g) => g.name);

    // Select disliked genres (0-2)
    const dislikedCount = faker.number.int({ min: 0, max: 2 });
    const remainingGenres = shuffledGenres.slice(preferredCount);
    const dislikedGenres = remainingGenres
      .slice(0, dislikedCount)
      .map((g) => g.name);

    // Favorite directors (1-4)
    const directorCount = faker.number.int({ min: 1, max: 4 });
    const favoriteDirectors = faker.helpers.arrayElements(
      directors,
      directorCount
    );

    // Preferred decades (1-3)
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

async function createViewingHistory(
  testUsers: SeedUser[],
  movies: SeedMovie[]
) {
  console.log('Creando historial de visualización para usuarios de prueba...');

  for (const user of testUsers) {
    // Each user has watched 8-15 movies
    const viewCount = faker.number.int({ min: 8, max: 15 });
    const viewedMovies = faker.helpers.arrayElements(movies, viewCount);

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
        // Ignore duplicates
      }
    }
  }
}

async function createRecommendations(
  testUsers: SeedUser[],
  movies: SeedMovie[]
) {
  console.log('Creando recomendaciones para usuarios de prueba...');

  const reasons = [
    'Basado en tus gustos',
    'Porque te gusta este director',
    'Popular entre usuarios similares',
    'Basado en tus géneros favoritos',
    'Porque has visto películas similares',
    'Recomendada por la crítica',
  ];

  for (const user of testUsers) {
    // Each user gets 5-10 recommendations
    const recommendationCount = faker.number.int({ min: 5, max: 10 });
    const moviesToRecommend = faker.helpers.arrayElements(
      movies,
      recommendationCount
    );

    for (const movie of moviesToRecommend) {
      try {
        await prisma.movieRecommendation.create({
          data: {
            userId: user.id,
            movieId: movie.id,
            score: faker.number.float({
              min: 0.5,
              max: 1.0,
              fractionDigits: 2,
            }),
            reason: faker.helpers.arrayElement(reasons),
            createdAt: faker.date.recent(),
            isViewed: faker.datatype.boolean(0.3), // 30% viewed
          },
        });
      } catch (error) {
        // Ignore duplicates
      }
    }
  }
}

async function createNotifications(testUsers: SeedUser[]) {
  console.log('Creando notificaciones para usuarios de prueba...');

  const notificationTypes = [
    'new_follower',
    'review_like',
    'review_comment',
    'movie_recommendation',
    'system_announcement',
    'list_mentioned',
  ];

  for (const user of testUsers) {
    // Each user has 3-10 notifications
    const notificationCount = faker.number.int({ min: 3, max: 10 });

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
          referenceId: null,
          isRead: faker.datatype.boolean(0.5), // 50% read
          createdAt: faker.date.recent(),
        },
      });
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
