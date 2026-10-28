############################### Query 1 ###############################
db.movies.find({"imdb.rating": {$gt: 8.5}, "imdb.votes": {$gt: 100000}, "awards.wins": {$gte: 5}}).projection({"title": 1, "year": 1, "awards.wins": 1, "imdb.rating": 1})

############################### Query 2 ###############################
db.theaters.find({"location.address.state": 'CA', "location.address.city":{ $in: ['San Francisco', 'Los Angeles']}}).projection({"theaterId": 1, "location.address.city": 1, "location.address.street1": 1, "location.address.street2": 1})


############################### Query 3 ###############################
db.movies.aggregate([{$match: {title: 'The Matrix', year: 1999}}, {$lookup: {from: 'comments', localField: '_id', foreignField: 'movie_id', as: 'movie_comments'}}])

############################### Query 4 ###############################
db.movies.aggregate([{$match: {'genres': 'Sci-Fi', 'imdb.rating': {$gt: 8.5}}}, {$lookup: {from: 'comments', let: {movieId: '$_id'}, pipeline: [{$match: {$expr: {$eq: ['$movie_id', '$$movieId']}}}, {$sort : {date: -1}}, {$limit: 3}, {$project: {name: 1, text: 1, date: 1, _id: 0}}], as: 'movie_comments'}}])
