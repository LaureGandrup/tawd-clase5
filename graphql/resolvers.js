const Product = require('../models/Product');

const resolvers = {
  Query: {
    // Obtener todos los productos y filtrarlos opcionalmente por categoría o precio
    products: async (_, { category, minPrice, maxPrice }) => {
      const filter = {};
      if (category) filter.category = category;
      if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {};
        if (minPrice !== undefined) filter.price.$gte = minPrice;
        if (maxPrice !== undefined) filter.price.$lte = maxPrice;
      }
      return await Product.find(filter);
    },
    // Obtener un solo producto por ID
    product: async (_, { id }) => {
      return await Product.findById(id);
    }
  },
  Mutation: {
    // Crear un nuevo producto
    createProduct: async (_, args) => {
      const newProduct = new Product(args);
      return await newProduct.save();
    },
    // Actualizar un producto existente
    updateProduct: async (_, { id, ...args }) => {
      // new: true devuelve el documento modificado en lugar del original
      return await Product.findByIdAndUpdate(id, args, { new: true });
    },
    // Eliminar un producto
    deleteProduct: async (_, { id }) => {
      await Product.findByIdAndDelete(id);
      return "Producto eliminado correctamente";
    }
  }
};

module.exports = resolvers;
