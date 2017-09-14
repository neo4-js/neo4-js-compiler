import { parse } from "../parser.js";

describe("parser", () => {
  it("should parse simplest possible model", () => {
    let schema = "type User { name: String }";

    try {
      const result = parse(schema);
      expect(result).toMatchSnapshot();
    } catch (err) {
      expect(err).toBeFalsy();
    }
  });

  it("should parse model without properties", () => {
    let schema = "type User { }";

    try {
      const result = parse(schema);
      expect(result).toMatchSnapshot();
    } catch (err) {
      expect(err).toBeFalsy();
    }
  });

  it("should parse schema with two models", () => {
    let schema = `
      type User {
        name: String
      };

      type Task {
        title: String;
        priority: Number
        done: Boolean,
      };
    `;

    try {
      const result = parse(schema);
      expect(result).toMatchSnapshot();
    } catch (err) {
      expect(err).toBeFalsy();
    }
  });

  it("should parse implements", () => {
    let schema = `
      type Node {
        id: String!
      }

      type User implements Node {
        name: String!
      }

      type Task implements Node {
        title: String!
      }
    `;

    try {
      const result = parse(schema);
      expect(result).toMatchSnapshot();
    } catch (err) {
      expect(err).toBeFalsy();
    }
  });

  it("should parse schema with simple relation", () => {
    let schema = `
      type User {
        name: String!
        tasks: has many Task using UserTaskRelation
      }

      type Task {
        title: String!,
        creator: has one User using UserTaskRelation
      }

      relation UserTaskRelation from User to Task via "created" {
        order: Number
      }
    `;

    try {
      const result = parse(schema);
      expect(result).toMatchSnapshot();
    } catch (err) {
      expect(err).toBeFalsy();
    }
  });

  it("should parse complex model", () => {
    let schema = `
      type Node {
        id: String!
      }

      type User implements Node {
        name: String!
        tasks: has many Task using UserCreatedTasks
        assignedTasks: has many Task using UserAssignedTasks
        age: Number
      }

      type Task {
        name: String!
        creator: has one User using UserCreatedTasks
        assignee: has one User using UserAssignedTasks,
        done: Boolean,
      }

      relation UserCreatedTasks from User to Task via "created" { }

      relation UserAssignedTasks from User to Task via "assigned" {
        assignedDate: String!
      }
    `;

    try {
      const result = parse(schema);
      expect(result).toMatchSnapshot();
    } catch (err) {
      expect(err).toBeFalsy();
    }
  });

  it("should parse default values", () => {
    let schema = `
      type User {
        name: String = "test",
        meh: Number = 3e4
      }

      type Task {
        name: String!;
        done: Boolean = false,
        order: Number = 394
      }
    `;

    try {
      const result = parse(schema);
      expect(result).toMatchSnapshot();
    } catch (err) {
      expect(err).toBeFalsy();
    }
  });
});
