import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./models/User.js";
import { Actor } from "./models/Actor.js";
import { Movie } from "./models/Movie.js";
import { Review } from "./models/Review.js";
 
process.loadEnvFile();
 
const users = [
  { username: "alice", email: "alice@cineverse.test" },
  { username: "bob", email: "bob@cineverse.test" },
  { username: "carol", email: "carol@cineverse.test" },
];
const PASSWORD = "Password123!";
 
const actors = [
  { name: "Robert Downey Jr.", birthdate: "1965-04-04" },
  { name: "Leonardo DiCaprio", birthdate: "1974-11-11" },
  { name: "Joseph Gordon-Levitt", birthdate: "1981-02-17" },
  { name: "Christian Bale", birthdate: "1974-01-30" },
  { name: "Heath Ledger", birthdate: "1979-04-04" },
  { name: "Keanu Reeves", birthdate: "1964-09-02" },
];
 
const movies = [
  {
    title: "Iron Man",
    year: 2008,
    genres: ["Sci-Fi", "Superhero"],
    director: "Jon Favreau",
    description: "Billionaire engineer Tony Stark builds a suit of armor to fight back after being held captive.",
    trailerLink: "https://www.youtube.com/watch?v=8ugaeA-nMTc",
    actors: ["Robert Downey Jr."],
    reviews: [["alice", 8, "Great origin story."], ["bob", 8, "Fun and stylish."]],
  },
  {
    title: "Inception",
    year: 2010,
    genres: ["Sci-Fi", "Thriller"],
    director: "Christopher Nolan",
    description: "A thief who steals secrets through dreams is tasked with planting an idea in a target's mind.",
    trailerLink: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
    reviews: [["alice", 9, "Mind-bending."], ["carol", 8, "Complex but rewarding."]],
  },
  {
    title: "The Dark Knight",
    year: 2008,
    genres: ["Action", "Crime", "Drama"],
    director: "Christopher Nolan",
    description: "Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy.",
    trailerLink: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    actors: ["Christian Bale", "Heath Ledger"],
    reviews: [["bob", 10, "Ledger is unforgettable."], ["carol", 9, ""]],
  },
  {
    title: "The Matrix",
    year: 1999,
    genres: ["Sci-Fi", "Action"],
    director: "The Wachowskis",
    description: "A hacker learns his reality is a simulation and joins a rebellion against the machines.",
    trailerLink: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
    actors: ["Keanu Reeves"],
    reviews: [],
  },
];
 
async function seed() {
  await mongoose.connect(process.env.MONGODB_URL);
 
  await Promise.all([Movie.deleteMany({}), Actor.deleteMany({}), Review.deleteMany({})]);
 
  // users
  const userDocs = {};
  const password = await bcrypt.hash(PASSWORD, 10);
  for (const u of users) {
    userDocs[u.username] =
      (await User.checkUserByEmail(u.email)) ||
      (await User.create({ ...u, password }));
  }
 
  // actors
  const actorDocs = {};
  for (const a of actors) {
    actorDocs[a.name] = await Actor.create({ ...a, birthdate: new Date(a.birthdate) });
  }
 
  // movies + reviews
  for (const { actors: actorNames, reviews, ...movie } of movies) {
    const doc = await Movie.create({
      ...movie,
      actors: actorNames.map((name) => actorDocs[name]._id),
    });
 
    for (const [username, number, comment] of reviews) {
      await Review.create({ number, comment, user: userDocs[username]._id, movie: doc._id });
    }
  }
 
  console.log(`Seeded ${users.length} users, ${actors.length} actors, ${movies.length} movies.`);
  console.log(`Login: ${users[0].email} / ${PASSWORD}`);
}
 
seed()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());