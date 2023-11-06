const { GraphQLObjectType, 
        GraphQLString, 
        GraphQLInt 
      } = require('graphql');

// agregar nuevo objeto llamado GraphQLString

const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
  },
});
