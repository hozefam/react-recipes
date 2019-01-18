exports.resolvers = {
  Query: {
    getAllRecipes: async (root, agrs, { Recipe }) => {
      const allRecipes = await Recipe.find();
      return allRecipes;
    }
  },
  Mutation: {
    addRecipe: async (
      root,
      { name, description, category, instructions, username },
      { Recipe }
    ) => {
      const newRecipe = await new Recipe({
        name,
        description,
        category,
        instructions,
        username
      }).save();
      return newRecipe;
    }
  }
};
