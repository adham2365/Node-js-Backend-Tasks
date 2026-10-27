############################### Query 1 ###############################
db.movies.find({year: 2015, genres: 'Action', runtime: {$gt: 120}})

############################### Query 2 ###############################
db.movies.find({directors: 'Christopher Nolan'}).projection({title: 1, year: 1, runtime: 1, _id: 0}).sort({year: -1})

############################### Query 3 ###############################
db.movies.insertOne({title: 'Spiderman Brand New Day', year: 2026, runtime: 150, rated: 'PG-13', type: 'movie', genres: ['Action', 'Adventure', 'Superhero'], num_mflix_comments: 67})

############################### Query 4 ###############################
db.movies.updateMany({year: 2014, num_mflix_comments: {$gt: 5}}, {$set: {isPopular: true}, $inc: {num_mflix_comments: 1}})

############################### Query 5 ###############################
db.movies.deleteMany({year: {$lt: 1920}, runtime: {$lt: 30}})

############################### Query 6 ###############################
db.movies.aggregate([{ $match: { year: { $gte: 2010 } } }, { $group: { _id: { year: '$year' }, total_movies: { $count: {} }, average_runtime: { $avg: '$runtime' } } }, { $sort: { _id: -1 } }])
