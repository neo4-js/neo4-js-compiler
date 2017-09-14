import { compile } from "../compiler.js";

describe("compiler", () => {
  // TODO: check other types than string
  it("should throw an error if default value doesn't match type", () => {
    const schema = `
      type User {
        name: String = 1
      }
    `;

    try {
      const result = compile(schema);
      expect(true).toEqual(false);
    } catch (err) {
      expect(err).toMatchSnapshot();
    }
  });

  it("should throw an error if model names are not unique", () => {
    const schema = `
      type User {
        name: String
      }

      type User {
        email: String
      }
    `;

    try {
      const result = compile(schema);
      expect(true).toEqual(false);
    } catch (err) {
      expect(err).toMatchSnapshot();
    }
  });

  it("should throw an error if relation is not defined but used", () => {
    let schema = `
      type User {
        name: String
        createdTasks: has many Task using UserCreatedTasks
      }

      type Task {
        title: String
        creator: has one User using UserCreatedTasks
      }
    `;

    try {
      const result = compile(schema);
      expect(true).toEqual(false);
    } catch (err) {
      expect(err).toMatchSnapshot();
    }
  });

  it("should throw an error if wrong destination model is used within a property definition", () => {
    let schema = `
      type User {
        name: String
        tasks: has many Task using UserTasksRelation
      }

      type Task {
        title: String
        creator: has one Comment using UserTasksRelation
      }

      type Comment { }

      relation UserTasksRelation from User to Task via "created" { }
    `;

    try {
      const result = compile(schema);
      expect(true).toEqual(false);
    } catch (err) {
      expect(err).toMatchSnapshot();
    }
  });

  it("should throw an error if a relation is used in a model which is not equal to from/to model names from relation", () => {
    let schema = `
      type User {
        name: String
      }

      type Task {
        title: String
        creator: has one User using UserTasksRelation
      }

      type Comment {
        tasks: has many Task using UserTasksRelation
      }

      relation UserTasksRelation from User to Task via "created" { }
    `;

    try {
      const result = compile(schema);
      expect(true).toEqual(false);
    } catch (err) {
      expect(err).toMatchSnapshot();
    }
  });

  it("should throw an error if wrong destination model is used within a property definition in a recursive relation", () => {
    let schema = `
      type User {
        name: String
        tasks: has many Task using UserUserRelation
      }

      relation UserUserRelation from User to User via "created" { }
    `;

    try {
      const result = compile(schema);
      expect(true).toEqual(false);
    } catch (err) {
      expect(err).toMatchSnapshot();
    }
  });

  it("should compile simplest possible schema", () => {
    let schema = `type User { name: String }`;
    try {
      const result = compile(schema);
      expect(result).toMatchSnapshot();
    } catch (err) {
      expect(err).toBeFalsy();
    }
  });

  it("should compile complex schemas", () => {
    let schema = `
      type User {
        name: String,
        age: Number,
        activated: Boolean,
      }

      type Task {
        title: String = "empty",
        done: Boolean = false,
      }
    `;
    try {
      const result = compile(schema);
      expect(result).toMatchSnapshot();
    } catch (err) {
      expect(err).toBeFalsy();
    }
  });

  it("should compile schema with simple relation", () => {
    let schema = `
      type User {
        name: String,
        age: Number,
        activated: Boolean,
        createdTasks: has many Task using TaskCreatorRelation,
      }

      type Task {
        title: String = "empty",
        done: Boolean = false,
        creator: has one User using TaskCreatorRelation
      }

      relation TaskCreatorRelation from User to Task via "created" { }
    `;
    try {
      const result = compile(schema);
      expect(result).toMatchSnapshot();
    } catch (err) {
      expect(err).toBeFalsy();
    }
  });

  it("should compile schema with recursive relation", () => {
    let schema = `
      type User {
        name: String,
        age: Number,
        activated: Boolean,
        parent: has one User using ParentRelation out,
        children: has many User using ParentRelation in,
      }

      relation ParentRelation from User to User via "parent" { }
    `;
    try {
      const result = compile(schema);
      expect(result).toMatchSnapshot();
    } catch (err) {
      expect(err).toBeFalsy();
    }
  });
});
