
import { buildClient, BaseClient } from "@xata.io/client"; 
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";


require('dotenv').config();


const tables = [
  {
    name: "Comment",
    checkConstraints: {
      Comment_xata_id_length_xata_id: {
        name: "Comment_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {
      task_id_link: {
        name: "task_id_link",
        columns: ["task_id"],
        referencedTable: "Task",
        referencedColumns: ["xata_id"],
        onDelete: "RESTRICT",
      },
      user_id_link: {
        name: "user_id_link",
        columns: ["user_id"],
        referencedTable: "Users",
        referencedColumns: ["xata_id"],
        onDelete: "RESTRICT",
      },
    },
    primaryKey: [],
    uniqueConstraints: {
      Comment__pgroll_new_task_id_key: {
        name: "Comment__pgroll_new_task_id_key",
        columns: ["task_id"],
      },
      Comment__pgroll_new_user_id_key: {
        name: "Comment__pgroll_new_user_id_key",
        columns: ["user_id"],
      },
      _pgroll_new_Comment_xata_id_key: {
        name: "_pgroll_new_Comment_xata_id_key",
        columns: ["xata_id"],
      },
    },
    columns: [
      {
        name: "content",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "task_id",
        type: "link",
        link: { table: "Task" },
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: '{"xata.link":"Task"}',
      },
      {
        name: "user_id",
        type: "link",
        link: { table: "Users" },
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: '{"xata.link":"Users"}',
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
  {
    name: "Project",
    checkConstraints: {
      Project_xata_id_length_xata_id: {
        name: "Project_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {
      team_id_link: {
        name: "team_id_link",
        columns: ["team_id"],
        referencedTable: "Team",
        referencedColumns: ["xata_id"],
        onDelete: "RESTRICT",
      },
    },
    primaryKey: [],
    uniqueConstraints: {
      Project__pgroll_new_team_id_key: {
        name: "Project__pgroll_new_team_id_key",
        columns: ["team_id"],
      },
      _pgroll_new_Project_xata_id_key: {
        name: "_pgroll_new_Project_xata_id_key",
        columns: ["xata_id"],
      },
    },
    columns: [
      {
        name: "name",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "team_id",
        type: "link",
        link: { table: "Team" },
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: '{"xata.link":"Team"}',
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
  {
    name: "Task",
    checkConstraints: {
      Task_xata_id_length_xata_id: {
        name: "Task_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {
      assignedToId_link: {
        name: "assignedToId_link",
        columns: ["assignedToId"],
        referencedTable: "Users",
        referencedColumns: ["xata_id"],
        onDelete: "RESTRICT",
      },
      projectid_link: {
        name: "projectid_link",
        columns: ["projectid"],
        referencedTable: "Project",
        referencedColumns: ["xata_id"],
        onDelete: "RESTRICT",
      },
    },
    primaryKey: [],
    uniqueConstraints: {
      Task__pgroll_new_assignedToId_key: {
        name: "Task__pgroll_new_assignedToId_key",
        columns: ["assignedToId"],
      },
      Task__pgroll_new_projectid_key: {
        name: "Task__pgroll_new_projectid_key",
        columns: ["projectid"],
      },
      _pgroll_new_Task_xata_id_key: {
        name: "_pgroll_new_Task_xata_id_key",
        columns: ["xata_id"],
      },
    },
    columns: [
      {
        name: "assignedToId",
        type: "link",
        link: { table: "Users" },
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: '{"xata.link":"Users"}',
      },
      {
        name: "description",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "duedate",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "projectid",
        type: "link",
        link: { table: "Project" },
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: '{"xata.link":"Project"}',
      },
      {
        name: "status",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
  {
    name: "Team",
    checkConstraints: {
      Team_xata_id_length_xata_id: {
        name: "Team_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {
      admin_id_link: {
        name: "admin_id_link",
        columns: ["admin_id"],
        referencedTable: "Users",
        referencedColumns: ["xata_id"],
        onDelete: "RESTRICT",
      },
    },
    primaryKey: [],
    uniqueConstraints: {
      Team__pgroll_new_admin_id_key: {
        name: "Team__pgroll_new_admin_id_key",
        columns: ["admin_id"],
      },
      _pgroll_new_Team_xata_id_key: {
        name: "_pgroll_new_Team_xata_id_key",
        columns: ["xata_id"],
      },
    },
    columns: [
      {
        name: "admin_id",
        type: "link",
        link: { table: "Users" },
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: '{"xata.link":"Users"}',
      },
      {
        name: "name",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
  {
    name: "Users",
    checkConstraints: {
      Users_xata_id_length_xata_id: {
        name: "Users_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    primaryKey: [],
    uniqueConstraints: {
      _pgroll_new_Users_xata_id_key: {
        name: "_pgroll_new_Users_xata_id_key",
        columns: ["xata_id"],
      },
    },
    columns: [
      {
        name: "email",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: "",
      },
      {
        name: "name",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "password",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "role",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
] as const;

// Schema inference from the defined tables
export type DatabaseSchema = SchemaInference<typeof tables>;

// Define types for each table
export type Comment = DatabaseSchema["Comment"];
export type CommentRecord = Comment & XataRecord;
export type Project = DatabaseSchema["Project"];
export type ProjectRecord = Project & XataRecord;
export type Task = DatabaseSchema["Task"];
export type TaskRecord = Task & XataRecord;
export type Team = DatabaseSchema["Team"];
export type TeamRecord = Team & XataRecord;
export type Users = DatabaseSchema["Users"];
export type UsersRecord = Users & XataRecord;


const defaultOptions = {
  databaseURL: "https://pgroll.xata.sh/db/pgroll", 
};


export class XataClient extends BaseClient {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }); 
  }
}

const xata = new XataClient({
  apiKey: process.env.XATA_API_KEY, 
  databaseURL: process.env.XATA_API_URL 
});


let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance; 

  instance = new XataClient(); 
  return instance; 
};
