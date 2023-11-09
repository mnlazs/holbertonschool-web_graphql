const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');
// const _ = require('lodash'); // Used to find data in the dummy data
const projectModel = require('../node_modules/project');
const Task = require('../node_modules/task');

// Definicion del tipo Task con dos parametros
const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({ // Using a function to avoid circular dependencies
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      weight: { type: GraphQLInt },
      description: { type: GraphQLString },
      // Define the project field with relation to the ProjectType
      project: {
          type: ProjectType,
          resolve: (parent, args) => {
              // Use the Project model to find the project with the id
              return Project.findById(parent.projectId);
          }
      }
  })
});

// Define the project type "GraphQLObjectType" con dos parametros (task-3)
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({ // Using a function to avoid circular dependencies
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      weight: { type: GraphQLInt },
      description: { type: GraphQLString },
      // Define the tasks field with relation to the TaskType
      tasks: {
          type: new GraphQLList(TaskType),
          resolve: (parent, args) => {
              // Use the Task model to find all tasks associated with this project
              return Task.find({ projectId: parent.id });
          }
      }
  })
});

// Debes crear un nuevo tipo de GraphQL llamado RootQueryType en el archivo schema.js.
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
      task: {
          type: TaskType,
          args: {
              id: { type: GraphQLID }
          },
          resolve: (parent, args) => {
              // Use the Task model to find a single task by ID
              return Task.findById(args.id);
          }
      },
      project: {
          type: ProjectType,
          args: {
              id: { type: GraphQLID }
          },
          resolve: (parent, args) => {
              // Use the Project model to find a single project by ID
              return Project.findById(args.id);
          }
      },
      tasks: {
          type: new GraphQLList(TaskType),
          resolve: (parent, args) => {
              // cuando se realice una consulta a este campo, se esperará que retorne información de una tarea, 
            return Task.find({});
          }
      },
      projects: {
          type: new GraphQLList(ProjectType),
          resolve: (parent, args) => {
              // Use the Project model to find all projects
              return Project.find({});
          }
      }
  }
});

// Creando una nueva mutación GraphQLObjectType con el nombre Mutación (Task-7)
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
      addTask: {
          type: TaskType,
          args: {
              title: { type: new GraphQLNonNull(GraphQLString) },
              weight: { type: new GraphQLNonNull(GraphQLInt) },
              description: { type: new GraphQLNonNull(GraphQLString) },
              projectId: { type: new GraphQLNonNull(GraphQLID) }
          },
          resolve: (parent, args) => {
              // Create a new task with the args
              let task = new Task({
                  title: args.title,
                  weight: args.weight,
                  description: args.description,
                  projectId: args.projectId
              });
              // Save the task in the database
              return task.save();
          }
      },
      addProject: {
          type: ProjectType,
          args: {
              title: { type: new GraphQLNonNull(GraphQLString) },
              weight: { type: new GraphQLNonNull(GraphQLInt) },
              description: { type: new GraphQLNonNull(GraphQLString) }
          },
          resolve: (parent, args) => {
              // Create a new project with the args
              let project = new Project({
                  title: args.title,
                  weight: args.weight,
                  description: args.description
              });
              // Save the project in the database
              return project.save();
          }
      }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
