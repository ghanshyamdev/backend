const Sequelize = require('sequelize')
const epilogue = require('epilogue')

const database = new Sequelize({
  dialect: 'sqlite',
  storage: './test.sqlite',
  operatorsAliases: false
})

const Article = database.define('articles', {
  title: Sequelize.STRING,
  desc: Sequelize.STRING,
  price: Sequelize.NUMERIC(10,2),
  rating: Sequelize.INTEGER,
  imageURL: Sequelize.STRING
})

const initializeDatabase = async (app) => {
  epilogue.initialize({ app, sequelize: database })

  epilogue.resource({
    model: Article,
    endpoints: ['/articles', '/articles/:id']
  })

  await database.sync()
}

const getArticlePaginated = async (pno, size) =>{
 return await Article.findAll({ offset: pno * size, limit: size })
}
module.exports = {initializeDatabase, getArticlePaginated};
