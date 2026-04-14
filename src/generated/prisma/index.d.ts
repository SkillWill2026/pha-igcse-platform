
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model answers
 * 
 */
export type answers = $Result.DefaultSelection<Prisma.$answersPayload>
/**
 * Model databank_chunks
 * 
 */
export type databank_chunks = $Result.DefaultSelection<Prisma.$databank_chunksPayload>
/**
 * Model databank_documents
 * 
 */
export type databank_documents = $Result.DefaultSelection<Prisma.$databank_documentsPayload>
/**
 * Model exam_boards
 * 
 */
export type exam_boards = $Result.DefaultSelection<Prisma.$exam_boardsPayload>
/**
 * Model ppt_decks
 * 
 */
export type ppt_decks = $Result.DefaultSelection<Prisma.$ppt_decksPayload>
/**
 * Model production_targets
 * 
 */
export type production_targets = $Result.DefaultSelection<Prisma.$production_targetsPayload>
/**
 * Model profiles
 * 
 */
export type profiles = $Result.DefaultSelection<Prisma.$profilesPayload>
/**
 * Model question_images
 * 
 */
export type question_images = $Result.DefaultSelection<Prisma.$question_imagesPayload>
/**
 * Model questions
 * 
 */
export type questions = $Result.DefaultSelection<Prisma.$questionsPayload>
/**
 * Model sub_subtopics
 * 
 */
export type sub_subtopics = $Result.DefaultSelection<Prisma.$sub_subtopicsPayload>
/**
 * Model subtopics
 * 
 */
export type subtopics = $Result.DefaultSelection<Prisma.$subtopicsPayload>
/**
 * Model topics
 * 
 */
export type topics = $Result.DefaultSelection<Prisma.$topicsPayload>
/**
 * Model upload_batches
 * 
 */
export type upload_batches = $Result.DefaultSelection<Prisma.$upload_batchesPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Answers
 * const answers = await prisma.answers.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Answers
   * const answers = await prisma.answers.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.answers`: Exposes CRUD operations for the **answers** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Answers
    * const answers = await prisma.answers.findMany()
    * ```
    */
  get answers(): Prisma.answersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.databank_chunks`: Exposes CRUD operations for the **databank_chunks** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Databank_chunks
    * const databank_chunks = await prisma.databank_chunks.findMany()
    * ```
    */
  get databank_chunks(): Prisma.databank_chunksDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.databank_documents`: Exposes CRUD operations for the **databank_documents** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Databank_documents
    * const databank_documents = await prisma.databank_documents.findMany()
    * ```
    */
  get databank_documents(): Prisma.databank_documentsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.exam_boards`: Exposes CRUD operations for the **exam_boards** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Exam_boards
    * const exam_boards = await prisma.exam_boards.findMany()
    * ```
    */
  get exam_boards(): Prisma.exam_boardsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ppt_decks`: Exposes CRUD operations for the **ppt_decks** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ppt_decks
    * const ppt_decks = await prisma.ppt_decks.findMany()
    * ```
    */
  get ppt_decks(): Prisma.ppt_decksDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.production_targets`: Exposes CRUD operations for the **production_targets** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Production_targets
    * const production_targets = await prisma.production_targets.findMany()
    * ```
    */
  get production_targets(): Prisma.production_targetsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.profiles`: Exposes CRUD operations for the **profiles** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Profiles
    * const profiles = await prisma.profiles.findMany()
    * ```
    */
  get profiles(): Prisma.profilesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.question_images`: Exposes CRUD operations for the **question_images** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Question_images
    * const question_images = await prisma.question_images.findMany()
    * ```
    */
  get question_images(): Prisma.question_imagesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.questions`: Exposes CRUD operations for the **questions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Questions
    * const questions = await prisma.questions.findMany()
    * ```
    */
  get questions(): Prisma.questionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sub_subtopics`: Exposes CRUD operations for the **sub_subtopics** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sub_subtopics
    * const sub_subtopics = await prisma.sub_subtopics.findMany()
    * ```
    */
  get sub_subtopics(): Prisma.sub_subtopicsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subtopics`: Exposes CRUD operations for the **subtopics** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subtopics
    * const subtopics = await prisma.subtopics.findMany()
    * ```
    */
  get subtopics(): Prisma.subtopicsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.topics`: Exposes CRUD operations for the **topics** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Topics
    * const topics = await prisma.topics.findMany()
    * ```
    */
  get topics(): Prisma.topicsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.upload_batches`: Exposes CRUD operations for the **upload_batches** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Upload_batches
    * const upload_batches = await prisma.upload_batches.findMany()
    * ```
    */
  get upload_batches(): Prisma.upload_batchesDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.7.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    answers: 'answers',
    databank_chunks: 'databank_chunks',
    databank_documents: 'databank_documents',
    exam_boards: 'exam_boards',
    ppt_decks: 'ppt_decks',
    production_targets: 'production_targets',
    profiles: 'profiles',
    question_images: 'question_images',
    questions: 'questions',
    sub_subtopics: 'sub_subtopics',
    subtopics: 'subtopics',
    topics: 'topics',
    upload_batches: 'upload_batches'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "answers" | "databank_chunks" | "databank_documents" | "exam_boards" | "ppt_decks" | "production_targets" | "profiles" | "question_images" | "questions" | "sub_subtopics" | "subtopics" | "topics" | "upload_batches"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      answers: {
        payload: Prisma.$answersPayload<ExtArgs>
        fields: Prisma.answersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.answersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$answersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.answersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$answersPayload>
          }
          findFirst: {
            args: Prisma.answersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$answersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.answersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$answersPayload>
          }
          findMany: {
            args: Prisma.answersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$answersPayload>[]
          }
          create: {
            args: Prisma.answersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$answersPayload>
          }
          createMany: {
            args: Prisma.answersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.answersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$answersPayload>[]
          }
          delete: {
            args: Prisma.answersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$answersPayload>
          }
          update: {
            args: Prisma.answersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$answersPayload>
          }
          deleteMany: {
            args: Prisma.answersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.answersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.answersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$answersPayload>[]
          }
          upsert: {
            args: Prisma.answersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$answersPayload>
          }
          aggregate: {
            args: Prisma.AnswersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnswers>
          }
          groupBy: {
            args: Prisma.answersGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnswersGroupByOutputType>[]
          }
          count: {
            args: Prisma.answersCountArgs<ExtArgs>
            result: $Utils.Optional<AnswersCountAggregateOutputType> | number
          }
        }
      }
      databank_chunks: {
        payload: Prisma.$databank_chunksPayload<ExtArgs>
        fields: Prisma.databank_chunksFieldRefs
        operations: {
          findUnique: {
            args: Prisma.databank_chunksFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_chunksPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.databank_chunksFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_chunksPayload>
          }
          findFirst: {
            args: Prisma.databank_chunksFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_chunksPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.databank_chunksFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_chunksPayload>
          }
          findMany: {
            args: Prisma.databank_chunksFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_chunksPayload>[]
          }
          create: {
            args: Prisma.databank_chunksCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_chunksPayload>
          }
          createMany: {
            args: Prisma.databank_chunksCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.databank_chunksCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_chunksPayload>[]
          }
          delete: {
            args: Prisma.databank_chunksDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_chunksPayload>
          }
          update: {
            args: Prisma.databank_chunksUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_chunksPayload>
          }
          deleteMany: {
            args: Prisma.databank_chunksDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.databank_chunksUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.databank_chunksUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_chunksPayload>[]
          }
          upsert: {
            args: Prisma.databank_chunksUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_chunksPayload>
          }
          aggregate: {
            args: Prisma.Databank_chunksAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDatabank_chunks>
          }
          groupBy: {
            args: Prisma.databank_chunksGroupByArgs<ExtArgs>
            result: $Utils.Optional<Databank_chunksGroupByOutputType>[]
          }
          count: {
            args: Prisma.databank_chunksCountArgs<ExtArgs>
            result: $Utils.Optional<Databank_chunksCountAggregateOutputType> | number
          }
        }
      }
      databank_documents: {
        payload: Prisma.$databank_documentsPayload<ExtArgs>
        fields: Prisma.databank_documentsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.databank_documentsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_documentsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.databank_documentsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_documentsPayload>
          }
          findFirst: {
            args: Prisma.databank_documentsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_documentsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.databank_documentsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_documentsPayload>
          }
          findMany: {
            args: Prisma.databank_documentsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_documentsPayload>[]
          }
          create: {
            args: Prisma.databank_documentsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_documentsPayload>
          }
          createMany: {
            args: Prisma.databank_documentsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.databank_documentsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_documentsPayload>[]
          }
          delete: {
            args: Prisma.databank_documentsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_documentsPayload>
          }
          update: {
            args: Prisma.databank_documentsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_documentsPayload>
          }
          deleteMany: {
            args: Prisma.databank_documentsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.databank_documentsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.databank_documentsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_documentsPayload>[]
          }
          upsert: {
            args: Prisma.databank_documentsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$databank_documentsPayload>
          }
          aggregate: {
            args: Prisma.Databank_documentsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDatabank_documents>
          }
          groupBy: {
            args: Prisma.databank_documentsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Databank_documentsGroupByOutputType>[]
          }
          count: {
            args: Prisma.databank_documentsCountArgs<ExtArgs>
            result: $Utils.Optional<Databank_documentsCountAggregateOutputType> | number
          }
        }
      }
      exam_boards: {
        payload: Prisma.$exam_boardsPayload<ExtArgs>
        fields: Prisma.exam_boardsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.exam_boardsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$exam_boardsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.exam_boardsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$exam_boardsPayload>
          }
          findFirst: {
            args: Prisma.exam_boardsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$exam_boardsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.exam_boardsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$exam_boardsPayload>
          }
          findMany: {
            args: Prisma.exam_boardsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$exam_boardsPayload>[]
          }
          create: {
            args: Prisma.exam_boardsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$exam_boardsPayload>
          }
          createMany: {
            args: Prisma.exam_boardsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.exam_boardsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$exam_boardsPayload>[]
          }
          delete: {
            args: Prisma.exam_boardsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$exam_boardsPayload>
          }
          update: {
            args: Prisma.exam_boardsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$exam_boardsPayload>
          }
          deleteMany: {
            args: Prisma.exam_boardsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.exam_boardsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.exam_boardsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$exam_boardsPayload>[]
          }
          upsert: {
            args: Prisma.exam_boardsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$exam_boardsPayload>
          }
          aggregate: {
            args: Prisma.Exam_boardsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExam_boards>
          }
          groupBy: {
            args: Prisma.exam_boardsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Exam_boardsGroupByOutputType>[]
          }
          count: {
            args: Prisma.exam_boardsCountArgs<ExtArgs>
            result: $Utils.Optional<Exam_boardsCountAggregateOutputType> | number
          }
        }
      }
      ppt_decks: {
        payload: Prisma.$ppt_decksPayload<ExtArgs>
        fields: Prisma.ppt_decksFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ppt_decksFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ppt_decksPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ppt_decksFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ppt_decksPayload>
          }
          findFirst: {
            args: Prisma.ppt_decksFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ppt_decksPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ppt_decksFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ppt_decksPayload>
          }
          findMany: {
            args: Prisma.ppt_decksFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ppt_decksPayload>[]
          }
          create: {
            args: Prisma.ppt_decksCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ppt_decksPayload>
          }
          createMany: {
            args: Prisma.ppt_decksCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ppt_decksCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ppt_decksPayload>[]
          }
          delete: {
            args: Prisma.ppt_decksDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ppt_decksPayload>
          }
          update: {
            args: Prisma.ppt_decksUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ppt_decksPayload>
          }
          deleteMany: {
            args: Prisma.ppt_decksDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ppt_decksUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ppt_decksUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ppt_decksPayload>[]
          }
          upsert: {
            args: Prisma.ppt_decksUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ppt_decksPayload>
          }
          aggregate: {
            args: Prisma.Ppt_decksAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePpt_decks>
          }
          groupBy: {
            args: Prisma.ppt_decksGroupByArgs<ExtArgs>
            result: $Utils.Optional<Ppt_decksGroupByOutputType>[]
          }
          count: {
            args: Prisma.ppt_decksCountArgs<ExtArgs>
            result: $Utils.Optional<Ppt_decksCountAggregateOutputType> | number
          }
        }
      }
      production_targets: {
        payload: Prisma.$production_targetsPayload<ExtArgs>
        fields: Prisma.production_targetsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.production_targetsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$production_targetsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.production_targetsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$production_targetsPayload>
          }
          findFirst: {
            args: Prisma.production_targetsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$production_targetsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.production_targetsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$production_targetsPayload>
          }
          findMany: {
            args: Prisma.production_targetsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$production_targetsPayload>[]
          }
          create: {
            args: Prisma.production_targetsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$production_targetsPayload>
          }
          createMany: {
            args: Prisma.production_targetsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.production_targetsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$production_targetsPayload>[]
          }
          delete: {
            args: Prisma.production_targetsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$production_targetsPayload>
          }
          update: {
            args: Prisma.production_targetsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$production_targetsPayload>
          }
          deleteMany: {
            args: Prisma.production_targetsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.production_targetsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.production_targetsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$production_targetsPayload>[]
          }
          upsert: {
            args: Prisma.production_targetsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$production_targetsPayload>
          }
          aggregate: {
            args: Prisma.Production_targetsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduction_targets>
          }
          groupBy: {
            args: Prisma.production_targetsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Production_targetsGroupByOutputType>[]
          }
          count: {
            args: Prisma.production_targetsCountArgs<ExtArgs>
            result: $Utils.Optional<Production_targetsCountAggregateOutputType> | number
          }
        }
      }
      profiles: {
        payload: Prisma.$profilesPayload<ExtArgs>
        fields: Prisma.profilesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.profilesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.profilesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>
          }
          findFirst: {
            args: Prisma.profilesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.profilesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>
          }
          findMany: {
            args: Prisma.profilesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>[]
          }
          create: {
            args: Prisma.profilesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>
          }
          createMany: {
            args: Prisma.profilesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.profilesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>[]
          }
          delete: {
            args: Prisma.profilesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>
          }
          update: {
            args: Prisma.profilesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>
          }
          deleteMany: {
            args: Prisma.profilesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.profilesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.profilesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>[]
          }
          upsert: {
            args: Prisma.profilesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>
          }
          aggregate: {
            args: Prisma.ProfilesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfiles>
          }
          groupBy: {
            args: Prisma.profilesGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfilesGroupByOutputType>[]
          }
          count: {
            args: Prisma.profilesCountArgs<ExtArgs>
            result: $Utils.Optional<ProfilesCountAggregateOutputType> | number
          }
        }
      }
      question_images: {
        payload: Prisma.$question_imagesPayload<ExtArgs>
        fields: Prisma.question_imagesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.question_imagesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$question_imagesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.question_imagesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$question_imagesPayload>
          }
          findFirst: {
            args: Prisma.question_imagesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$question_imagesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.question_imagesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$question_imagesPayload>
          }
          findMany: {
            args: Prisma.question_imagesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$question_imagesPayload>[]
          }
          create: {
            args: Prisma.question_imagesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$question_imagesPayload>
          }
          createMany: {
            args: Prisma.question_imagesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.question_imagesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$question_imagesPayload>[]
          }
          delete: {
            args: Prisma.question_imagesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$question_imagesPayload>
          }
          update: {
            args: Prisma.question_imagesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$question_imagesPayload>
          }
          deleteMany: {
            args: Prisma.question_imagesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.question_imagesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.question_imagesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$question_imagesPayload>[]
          }
          upsert: {
            args: Prisma.question_imagesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$question_imagesPayload>
          }
          aggregate: {
            args: Prisma.Question_imagesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuestion_images>
          }
          groupBy: {
            args: Prisma.question_imagesGroupByArgs<ExtArgs>
            result: $Utils.Optional<Question_imagesGroupByOutputType>[]
          }
          count: {
            args: Prisma.question_imagesCountArgs<ExtArgs>
            result: $Utils.Optional<Question_imagesCountAggregateOutputType> | number
          }
        }
      }
      questions: {
        payload: Prisma.$questionsPayload<ExtArgs>
        fields: Prisma.questionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.questionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$questionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.questionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$questionsPayload>
          }
          findFirst: {
            args: Prisma.questionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$questionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.questionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$questionsPayload>
          }
          findMany: {
            args: Prisma.questionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$questionsPayload>[]
          }
          create: {
            args: Prisma.questionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$questionsPayload>
          }
          createMany: {
            args: Prisma.questionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.questionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$questionsPayload>[]
          }
          delete: {
            args: Prisma.questionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$questionsPayload>
          }
          update: {
            args: Prisma.questionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$questionsPayload>
          }
          deleteMany: {
            args: Prisma.questionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.questionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.questionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$questionsPayload>[]
          }
          upsert: {
            args: Prisma.questionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$questionsPayload>
          }
          aggregate: {
            args: Prisma.QuestionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuestions>
          }
          groupBy: {
            args: Prisma.questionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuestionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.questionsCountArgs<ExtArgs>
            result: $Utils.Optional<QuestionsCountAggregateOutputType> | number
          }
        }
      }
      sub_subtopics: {
        payload: Prisma.$sub_subtopicsPayload<ExtArgs>
        fields: Prisma.sub_subtopicsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.sub_subtopicsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_subtopicsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.sub_subtopicsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_subtopicsPayload>
          }
          findFirst: {
            args: Prisma.sub_subtopicsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_subtopicsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.sub_subtopicsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_subtopicsPayload>
          }
          findMany: {
            args: Prisma.sub_subtopicsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_subtopicsPayload>[]
          }
          create: {
            args: Prisma.sub_subtopicsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_subtopicsPayload>
          }
          createMany: {
            args: Prisma.sub_subtopicsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.sub_subtopicsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_subtopicsPayload>[]
          }
          delete: {
            args: Prisma.sub_subtopicsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_subtopicsPayload>
          }
          update: {
            args: Prisma.sub_subtopicsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_subtopicsPayload>
          }
          deleteMany: {
            args: Prisma.sub_subtopicsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.sub_subtopicsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.sub_subtopicsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_subtopicsPayload>[]
          }
          upsert: {
            args: Prisma.sub_subtopicsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sub_subtopicsPayload>
          }
          aggregate: {
            args: Prisma.Sub_subtopicsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSub_subtopics>
          }
          groupBy: {
            args: Prisma.sub_subtopicsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Sub_subtopicsGroupByOutputType>[]
          }
          count: {
            args: Prisma.sub_subtopicsCountArgs<ExtArgs>
            result: $Utils.Optional<Sub_subtopicsCountAggregateOutputType> | number
          }
        }
      }
      subtopics: {
        payload: Prisma.$subtopicsPayload<ExtArgs>
        fields: Prisma.subtopicsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.subtopicsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subtopicsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.subtopicsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subtopicsPayload>
          }
          findFirst: {
            args: Prisma.subtopicsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subtopicsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.subtopicsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subtopicsPayload>
          }
          findMany: {
            args: Prisma.subtopicsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subtopicsPayload>[]
          }
          create: {
            args: Prisma.subtopicsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subtopicsPayload>
          }
          createMany: {
            args: Prisma.subtopicsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.subtopicsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subtopicsPayload>[]
          }
          delete: {
            args: Prisma.subtopicsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subtopicsPayload>
          }
          update: {
            args: Prisma.subtopicsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subtopicsPayload>
          }
          deleteMany: {
            args: Prisma.subtopicsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.subtopicsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.subtopicsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subtopicsPayload>[]
          }
          upsert: {
            args: Prisma.subtopicsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subtopicsPayload>
          }
          aggregate: {
            args: Prisma.SubtopicsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubtopics>
          }
          groupBy: {
            args: Prisma.subtopicsGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubtopicsGroupByOutputType>[]
          }
          count: {
            args: Prisma.subtopicsCountArgs<ExtArgs>
            result: $Utils.Optional<SubtopicsCountAggregateOutputType> | number
          }
        }
      }
      topics: {
        payload: Prisma.$topicsPayload<ExtArgs>
        fields: Prisma.topicsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.topicsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$topicsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.topicsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$topicsPayload>
          }
          findFirst: {
            args: Prisma.topicsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$topicsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.topicsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$topicsPayload>
          }
          findMany: {
            args: Prisma.topicsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$topicsPayload>[]
          }
          create: {
            args: Prisma.topicsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$topicsPayload>
          }
          createMany: {
            args: Prisma.topicsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.topicsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$topicsPayload>[]
          }
          delete: {
            args: Prisma.topicsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$topicsPayload>
          }
          update: {
            args: Prisma.topicsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$topicsPayload>
          }
          deleteMany: {
            args: Prisma.topicsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.topicsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.topicsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$topicsPayload>[]
          }
          upsert: {
            args: Prisma.topicsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$topicsPayload>
          }
          aggregate: {
            args: Prisma.TopicsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTopics>
          }
          groupBy: {
            args: Prisma.topicsGroupByArgs<ExtArgs>
            result: $Utils.Optional<TopicsGroupByOutputType>[]
          }
          count: {
            args: Prisma.topicsCountArgs<ExtArgs>
            result: $Utils.Optional<TopicsCountAggregateOutputType> | number
          }
        }
      }
      upload_batches: {
        payload: Prisma.$upload_batchesPayload<ExtArgs>
        fields: Prisma.upload_batchesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.upload_batchesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$upload_batchesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.upload_batchesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$upload_batchesPayload>
          }
          findFirst: {
            args: Prisma.upload_batchesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$upload_batchesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.upload_batchesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$upload_batchesPayload>
          }
          findMany: {
            args: Prisma.upload_batchesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$upload_batchesPayload>[]
          }
          create: {
            args: Prisma.upload_batchesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$upload_batchesPayload>
          }
          createMany: {
            args: Prisma.upload_batchesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.upload_batchesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$upload_batchesPayload>[]
          }
          delete: {
            args: Prisma.upload_batchesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$upload_batchesPayload>
          }
          update: {
            args: Prisma.upload_batchesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$upload_batchesPayload>
          }
          deleteMany: {
            args: Prisma.upload_batchesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.upload_batchesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.upload_batchesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$upload_batchesPayload>[]
          }
          upsert: {
            args: Prisma.upload_batchesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$upload_batchesPayload>
          }
          aggregate: {
            args: Prisma.Upload_batchesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUpload_batches>
          }
          groupBy: {
            args: Prisma.upload_batchesGroupByArgs<ExtArgs>
            result: $Utils.Optional<Upload_batchesGroupByOutputType>[]
          }
          count: {
            args: Prisma.upload_batchesCountArgs<ExtArgs>
            result: $Utils.Optional<Upload_batchesCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    answers?: answersOmit
    databank_chunks?: databank_chunksOmit
    databank_documents?: databank_documentsOmit
    exam_boards?: exam_boardsOmit
    ppt_decks?: ppt_decksOmit
    production_targets?: production_targetsOmit
    profiles?: profilesOmit
    question_images?: question_imagesOmit
    questions?: questionsOmit
    sub_subtopics?: sub_subtopicsOmit
    subtopics?: subtopicsOmit
    topics?: topicsOmit
    upload_batches?: upload_batchesOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model answers
   */

  export type AggregateAnswers = {
    _count: AnswersCountAggregateOutputType | null
    _min: AnswersMinAggregateOutputType | null
    _max: AnswersMaxAggregateOutputType | null
  }

  export type AnswersMinAggregateOutputType = {
    id: string | null
    question_id: string | null
    content_text: string | null
    status: string | null
    created_by: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type AnswersMaxAggregateOutputType = {
    id: string | null
    question_id: string | null
    content_text: string | null
    status: string | null
    created_by: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type AnswersCountAggregateOutputType = {
    id: number
    question_id: number
    content_text: number
    status: number
    created_by: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type AnswersMinAggregateInputType = {
    id?: true
    question_id?: true
    content_text?: true
    status?: true
    created_by?: true
    created_at?: true
    updated_at?: true
  }

  export type AnswersMaxAggregateInputType = {
    id?: true
    question_id?: true
    content_text?: true
    status?: true
    created_by?: true
    created_at?: true
    updated_at?: true
  }

  export type AnswersCountAggregateInputType = {
    id?: true
    question_id?: true
    content_text?: true
    status?: true
    created_by?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type AnswersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which answers to aggregate.
     */
    where?: answersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of answers to fetch.
     */
    orderBy?: answersOrderByWithRelationInput | answersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: answersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` answers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` answers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned answers
    **/
    _count?: true | AnswersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnswersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnswersMaxAggregateInputType
  }

  export type GetAnswersAggregateType<T extends AnswersAggregateArgs> = {
        [P in keyof T & keyof AggregateAnswers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnswers[P]>
      : GetScalarType<T[P], AggregateAnswers[P]>
  }




  export type answersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: answersWhereInput
    orderBy?: answersOrderByWithAggregationInput | answersOrderByWithAggregationInput[]
    by: AnswersScalarFieldEnum[] | AnswersScalarFieldEnum
    having?: answersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnswersCountAggregateInputType | true
    _min?: AnswersMinAggregateInputType
    _max?: AnswersMaxAggregateInputType
  }

  export type AnswersGroupByOutputType = {
    id: string
    question_id: string | null
    content_text: string | null
    status: string | null
    created_by: string | null
    created_at: Date | null
    updated_at: Date | null
    _count: AnswersCountAggregateOutputType | null
    _min: AnswersMinAggregateOutputType | null
    _max: AnswersMaxAggregateOutputType | null
  }

  type GetAnswersGroupByPayload<T extends answersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnswersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnswersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnswersGroupByOutputType[P]>
            : GetScalarType<T[P], AnswersGroupByOutputType[P]>
        }
      >
    >


  export type answersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question_id?: boolean
    content_text?: boolean
    status?: boolean
    created_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["answers"]>

  export type answersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question_id?: boolean
    content_text?: boolean
    status?: boolean
    created_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["answers"]>

  export type answersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question_id?: boolean
    content_text?: boolean
    status?: boolean
    created_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["answers"]>

  export type answersSelectScalar = {
    id?: boolean
    question_id?: boolean
    content_text?: boolean
    status?: boolean
    created_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type answersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "question_id" | "content_text" | "status" | "created_by" | "created_at" | "updated_at", ExtArgs["result"]["answers"]>

  export type $answersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "answers"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      question_id: string | null
      content_text: string | null
      status: string | null
      created_by: string | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["answers"]>
    composites: {}
  }

  type answersGetPayload<S extends boolean | null | undefined | answersDefaultArgs> = $Result.GetResult<Prisma.$answersPayload, S>

  type answersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<answersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnswersCountAggregateInputType | true
    }

  export interface answersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['answers'], meta: { name: 'answers' } }
    /**
     * Find zero or one Answers that matches the filter.
     * @param {answersFindUniqueArgs} args - Arguments to find a Answers
     * @example
     * // Get one Answers
     * const answers = await prisma.answers.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends answersFindUniqueArgs>(args: SelectSubset<T, answersFindUniqueArgs<ExtArgs>>): Prisma__answersClient<$Result.GetResult<Prisma.$answersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Answers that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {answersFindUniqueOrThrowArgs} args - Arguments to find a Answers
     * @example
     * // Get one Answers
     * const answers = await prisma.answers.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends answersFindUniqueOrThrowArgs>(args: SelectSubset<T, answersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__answersClient<$Result.GetResult<Prisma.$answersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Answers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {answersFindFirstArgs} args - Arguments to find a Answers
     * @example
     * // Get one Answers
     * const answers = await prisma.answers.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends answersFindFirstArgs>(args?: SelectSubset<T, answersFindFirstArgs<ExtArgs>>): Prisma__answersClient<$Result.GetResult<Prisma.$answersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Answers that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {answersFindFirstOrThrowArgs} args - Arguments to find a Answers
     * @example
     * // Get one Answers
     * const answers = await prisma.answers.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends answersFindFirstOrThrowArgs>(args?: SelectSubset<T, answersFindFirstOrThrowArgs<ExtArgs>>): Prisma__answersClient<$Result.GetResult<Prisma.$answersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Answers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {answersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Answers
     * const answers = await prisma.answers.findMany()
     * 
     * // Get first 10 Answers
     * const answers = await prisma.answers.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const answersWithIdOnly = await prisma.answers.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends answersFindManyArgs>(args?: SelectSubset<T, answersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$answersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Answers.
     * @param {answersCreateArgs} args - Arguments to create a Answers.
     * @example
     * // Create one Answers
     * const Answers = await prisma.answers.create({
     *   data: {
     *     // ... data to create a Answers
     *   }
     * })
     * 
     */
    create<T extends answersCreateArgs>(args: SelectSubset<T, answersCreateArgs<ExtArgs>>): Prisma__answersClient<$Result.GetResult<Prisma.$answersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Answers.
     * @param {answersCreateManyArgs} args - Arguments to create many Answers.
     * @example
     * // Create many Answers
     * const answers = await prisma.answers.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends answersCreateManyArgs>(args?: SelectSubset<T, answersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Answers and returns the data saved in the database.
     * @param {answersCreateManyAndReturnArgs} args - Arguments to create many Answers.
     * @example
     * // Create many Answers
     * const answers = await prisma.answers.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Answers and only return the `id`
     * const answersWithIdOnly = await prisma.answers.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends answersCreateManyAndReturnArgs>(args?: SelectSubset<T, answersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$answersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Answers.
     * @param {answersDeleteArgs} args - Arguments to delete one Answers.
     * @example
     * // Delete one Answers
     * const Answers = await prisma.answers.delete({
     *   where: {
     *     // ... filter to delete one Answers
     *   }
     * })
     * 
     */
    delete<T extends answersDeleteArgs>(args: SelectSubset<T, answersDeleteArgs<ExtArgs>>): Prisma__answersClient<$Result.GetResult<Prisma.$answersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Answers.
     * @param {answersUpdateArgs} args - Arguments to update one Answers.
     * @example
     * // Update one Answers
     * const answers = await prisma.answers.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends answersUpdateArgs>(args: SelectSubset<T, answersUpdateArgs<ExtArgs>>): Prisma__answersClient<$Result.GetResult<Prisma.$answersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Answers.
     * @param {answersDeleteManyArgs} args - Arguments to filter Answers to delete.
     * @example
     * // Delete a few Answers
     * const { count } = await prisma.answers.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends answersDeleteManyArgs>(args?: SelectSubset<T, answersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Answers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {answersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Answers
     * const answers = await prisma.answers.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends answersUpdateManyArgs>(args: SelectSubset<T, answersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Answers and returns the data updated in the database.
     * @param {answersUpdateManyAndReturnArgs} args - Arguments to update many Answers.
     * @example
     * // Update many Answers
     * const answers = await prisma.answers.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Answers and only return the `id`
     * const answersWithIdOnly = await prisma.answers.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends answersUpdateManyAndReturnArgs>(args: SelectSubset<T, answersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$answersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Answers.
     * @param {answersUpsertArgs} args - Arguments to update or create a Answers.
     * @example
     * // Update or create a Answers
     * const answers = await prisma.answers.upsert({
     *   create: {
     *     // ... data to create a Answers
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Answers we want to update
     *   }
     * })
     */
    upsert<T extends answersUpsertArgs>(args: SelectSubset<T, answersUpsertArgs<ExtArgs>>): Prisma__answersClient<$Result.GetResult<Prisma.$answersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Answers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {answersCountArgs} args - Arguments to filter Answers to count.
     * @example
     * // Count the number of Answers
     * const count = await prisma.answers.count({
     *   where: {
     *     // ... the filter for the Answers we want to count
     *   }
     * })
    **/
    count<T extends answersCountArgs>(
      args?: Subset<T, answersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnswersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Answers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnswersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnswersAggregateArgs>(args: Subset<T, AnswersAggregateArgs>): Prisma.PrismaPromise<GetAnswersAggregateType<T>>

    /**
     * Group by Answers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {answersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends answersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: answersGroupByArgs['orderBy'] }
        : { orderBy?: answersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, answersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnswersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the answers model
   */
  readonly fields: answersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for answers.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__answersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the answers model
   */
  interface answersFieldRefs {
    readonly id: FieldRef<"answers", 'String'>
    readonly question_id: FieldRef<"answers", 'String'>
    readonly content_text: FieldRef<"answers", 'String'>
    readonly status: FieldRef<"answers", 'String'>
    readonly created_by: FieldRef<"answers", 'String'>
    readonly created_at: FieldRef<"answers", 'DateTime'>
    readonly updated_at: FieldRef<"answers", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * answers findUnique
   */
  export type answersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the answers
     */
    select?: answersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the answers
     */
    omit?: answersOmit<ExtArgs> | null
    /**
     * Filter, which answers to fetch.
     */
    where: answersWhereUniqueInput
  }

  /**
   * answers findUniqueOrThrow
   */
  export type answersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the answers
     */
    select?: answersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the answers
     */
    omit?: answersOmit<ExtArgs> | null
    /**
     * Filter, which answers to fetch.
     */
    where: answersWhereUniqueInput
  }

  /**
   * answers findFirst
   */
  export type answersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the answers
     */
    select?: answersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the answers
     */
    omit?: answersOmit<ExtArgs> | null
    /**
     * Filter, which answers to fetch.
     */
    where?: answersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of answers to fetch.
     */
    orderBy?: answersOrderByWithRelationInput | answersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for answers.
     */
    cursor?: answersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` answers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` answers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of answers.
     */
    distinct?: AnswersScalarFieldEnum | AnswersScalarFieldEnum[]
  }

  /**
   * answers findFirstOrThrow
   */
  export type answersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the answers
     */
    select?: answersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the answers
     */
    omit?: answersOmit<ExtArgs> | null
    /**
     * Filter, which answers to fetch.
     */
    where?: answersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of answers to fetch.
     */
    orderBy?: answersOrderByWithRelationInput | answersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for answers.
     */
    cursor?: answersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` answers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` answers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of answers.
     */
    distinct?: AnswersScalarFieldEnum | AnswersScalarFieldEnum[]
  }

  /**
   * answers findMany
   */
  export type answersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the answers
     */
    select?: answersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the answers
     */
    omit?: answersOmit<ExtArgs> | null
    /**
     * Filter, which answers to fetch.
     */
    where?: answersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of answers to fetch.
     */
    orderBy?: answersOrderByWithRelationInput | answersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing answers.
     */
    cursor?: answersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` answers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` answers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of answers.
     */
    distinct?: AnswersScalarFieldEnum | AnswersScalarFieldEnum[]
  }

  /**
   * answers create
   */
  export type answersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the answers
     */
    select?: answersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the answers
     */
    omit?: answersOmit<ExtArgs> | null
    /**
     * The data needed to create a answers.
     */
    data?: XOR<answersCreateInput, answersUncheckedCreateInput>
  }

  /**
   * answers createMany
   */
  export type answersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many answers.
     */
    data: answersCreateManyInput | answersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * answers createManyAndReturn
   */
  export type answersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the answers
     */
    select?: answersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the answers
     */
    omit?: answersOmit<ExtArgs> | null
    /**
     * The data used to create many answers.
     */
    data: answersCreateManyInput | answersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * answers update
   */
  export type answersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the answers
     */
    select?: answersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the answers
     */
    omit?: answersOmit<ExtArgs> | null
    /**
     * The data needed to update a answers.
     */
    data: XOR<answersUpdateInput, answersUncheckedUpdateInput>
    /**
     * Choose, which answers to update.
     */
    where: answersWhereUniqueInput
  }

  /**
   * answers updateMany
   */
  export type answersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update answers.
     */
    data: XOR<answersUpdateManyMutationInput, answersUncheckedUpdateManyInput>
    /**
     * Filter which answers to update
     */
    where?: answersWhereInput
    /**
     * Limit how many answers to update.
     */
    limit?: number
  }

  /**
   * answers updateManyAndReturn
   */
  export type answersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the answers
     */
    select?: answersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the answers
     */
    omit?: answersOmit<ExtArgs> | null
    /**
     * The data used to update answers.
     */
    data: XOR<answersUpdateManyMutationInput, answersUncheckedUpdateManyInput>
    /**
     * Filter which answers to update
     */
    where?: answersWhereInput
    /**
     * Limit how many answers to update.
     */
    limit?: number
  }

  /**
   * answers upsert
   */
  export type answersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the answers
     */
    select?: answersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the answers
     */
    omit?: answersOmit<ExtArgs> | null
    /**
     * The filter to search for the answers to update in case it exists.
     */
    where: answersWhereUniqueInput
    /**
     * In case the answers found by the `where` argument doesn't exist, create a new answers with this data.
     */
    create: XOR<answersCreateInput, answersUncheckedCreateInput>
    /**
     * In case the answers was found with the provided `where` argument, update it with this data.
     */
    update: XOR<answersUpdateInput, answersUncheckedUpdateInput>
  }

  /**
   * answers delete
   */
  export type answersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the answers
     */
    select?: answersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the answers
     */
    omit?: answersOmit<ExtArgs> | null
    /**
     * Filter which answers to delete.
     */
    where: answersWhereUniqueInput
  }

  /**
   * answers deleteMany
   */
  export type answersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which answers to delete
     */
    where?: answersWhereInput
    /**
     * Limit how many answers to delete.
     */
    limit?: number
  }

  /**
   * answers without action
   */
  export type answersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the answers
     */
    select?: answersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the answers
     */
    omit?: answersOmit<ExtArgs> | null
  }


  /**
   * Model databank_chunks
   */

  export type AggregateDatabank_chunks = {
    _count: Databank_chunksCountAggregateOutputType | null
    _avg: Databank_chunksAvgAggregateOutputType | null
    _sum: Databank_chunksSumAggregateOutputType | null
    _min: Databank_chunksMinAggregateOutputType | null
    _max: Databank_chunksMaxAggregateOutputType | null
  }

  export type Databank_chunksAvgAggregateOutputType = {
    page_number: number | null
    chunk_index: number | null
    token_count: number | null
  }

  export type Databank_chunksSumAggregateOutputType = {
    page_number: number | null
    chunk_index: number | null
    token_count: number | null
  }

  export type Databank_chunksMinAggregateOutputType = {
    id: string | null
    document_id: string | null
    content: string | null
    page_number: number | null
    chunk_index: number | null
    token_count: number | null
    created_at: Date | null
  }

  export type Databank_chunksMaxAggregateOutputType = {
    id: string | null
    document_id: string | null
    content: string | null
    page_number: number | null
    chunk_index: number | null
    token_count: number | null
    created_at: Date | null
  }

  export type Databank_chunksCountAggregateOutputType = {
    id: number
    document_id: number
    content: number
    page_number: number
    chunk_index: number
    token_count: number
    created_at: number
    _all: number
  }


  export type Databank_chunksAvgAggregateInputType = {
    page_number?: true
    chunk_index?: true
    token_count?: true
  }

  export type Databank_chunksSumAggregateInputType = {
    page_number?: true
    chunk_index?: true
    token_count?: true
  }

  export type Databank_chunksMinAggregateInputType = {
    id?: true
    document_id?: true
    content?: true
    page_number?: true
    chunk_index?: true
    token_count?: true
    created_at?: true
  }

  export type Databank_chunksMaxAggregateInputType = {
    id?: true
    document_id?: true
    content?: true
    page_number?: true
    chunk_index?: true
    token_count?: true
    created_at?: true
  }

  export type Databank_chunksCountAggregateInputType = {
    id?: true
    document_id?: true
    content?: true
    page_number?: true
    chunk_index?: true
    token_count?: true
    created_at?: true
    _all?: true
  }

  export type Databank_chunksAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which databank_chunks to aggregate.
     */
    where?: databank_chunksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of databank_chunks to fetch.
     */
    orderBy?: databank_chunksOrderByWithRelationInput | databank_chunksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: databank_chunksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` databank_chunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` databank_chunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned databank_chunks
    **/
    _count?: true | Databank_chunksCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Databank_chunksAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Databank_chunksSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Databank_chunksMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Databank_chunksMaxAggregateInputType
  }

  export type GetDatabank_chunksAggregateType<T extends Databank_chunksAggregateArgs> = {
        [P in keyof T & keyof AggregateDatabank_chunks]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDatabank_chunks[P]>
      : GetScalarType<T[P], AggregateDatabank_chunks[P]>
  }




  export type databank_chunksGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: databank_chunksWhereInput
    orderBy?: databank_chunksOrderByWithAggregationInput | databank_chunksOrderByWithAggregationInput[]
    by: Databank_chunksScalarFieldEnum[] | Databank_chunksScalarFieldEnum
    having?: databank_chunksScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Databank_chunksCountAggregateInputType | true
    _avg?: Databank_chunksAvgAggregateInputType
    _sum?: Databank_chunksSumAggregateInputType
    _min?: Databank_chunksMinAggregateInputType
    _max?: Databank_chunksMaxAggregateInputType
  }

  export type Databank_chunksGroupByOutputType = {
    id: string
    document_id: string
    content: string
    page_number: number | null
    chunk_index: number
    token_count: number | null
    created_at: Date | null
    _count: Databank_chunksCountAggregateOutputType | null
    _avg: Databank_chunksAvgAggregateOutputType | null
    _sum: Databank_chunksSumAggregateOutputType | null
    _min: Databank_chunksMinAggregateOutputType | null
    _max: Databank_chunksMaxAggregateOutputType | null
  }

  type GetDatabank_chunksGroupByPayload<T extends databank_chunksGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Databank_chunksGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Databank_chunksGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Databank_chunksGroupByOutputType[P]>
            : GetScalarType<T[P], Databank_chunksGroupByOutputType[P]>
        }
      >
    >


  export type databank_chunksSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    document_id?: boolean
    content?: boolean
    page_number?: boolean
    chunk_index?: boolean
    token_count?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["databank_chunks"]>

  export type databank_chunksSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    document_id?: boolean
    content?: boolean
    page_number?: boolean
    chunk_index?: boolean
    token_count?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["databank_chunks"]>

  export type databank_chunksSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    document_id?: boolean
    content?: boolean
    page_number?: boolean
    chunk_index?: boolean
    token_count?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["databank_chunks"]>

  export type databank_chunksSelectScalar = {
    id?: boolean
    document_id?: boolean
    content?: boolean
    page_number?: boolean
    chunk_index?: boolean
    token_count?: boolean
    created_at?: boolean
  }

  export type databank_chunksOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "document_id" | "content" | "page_number" | "chunk_index" | "token_count" | "created_at", ExtArgs["result"]["databank_chunks"]>

  export type $databank_chunksPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "databank_chunks"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      document_id: string
      content: string
      page_number: number | null
      chunk_index: number
      token_count: number | null
      created_at: Date | null
    }, ExtArgs["result"]["databank_chunks"]>
    composites: {}
  }

  type databank_chunksGetPayload<S extends boolean | null | undefined | databank_chunksDefaultArgs> = $Result.GetResult<Prisma.$databank_chunksPayload, S>

  type databank_chunksCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<databank_chunksFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Databank_chunksCountAggregateInputType | true
    }

  export interface databank_chunksDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['databank_chunks'], meta: { name: 'databank_chunks' } }
    /**
     * Find zero or one Databank_chunks that matches the filter.
     * @param {databank_chunksFindUniqueArgs} args - Arguments to find a Databank_chunks
     * @example
     * // Get one Databank_chunks
     * const databank_chunks = await prisma.databank_chunks.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends databank_chunksFindUniqueArgs>(args: SelectSubset<T, databank_chunksFindUniqueArgs<ExtArgs>>): Prisma__databank_chunksClient<$Result.GetResult<Prisma.$databank_chunksPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Databank_chunks that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {databank_chunksFindUniqueOrThrowArgs} args - Arguments to find a Databank_chunks
     * @example
     * // Get one Databank_chunks
     * const databank_chunks = await prisma.databank_chunks.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends databank_chunksFindUniqueOrThrowArgs>(args: SelectSubset<T, databank_chunksFindUniqueOrThrowArgs<ExtArgs>>): Prisma__databank_chunksClient<$Result.GetResult<Prisma.$databank_chunksPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Databank_chunks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {databank_chunksFindFirstArgs} args - Arguments to find a Databank_chunks
     * @example
     * // Get one Databank_chunks
     * const databank_chunks = await prisma.databank_chunks.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends databank_chunksFindFirstArgs>(args?: SelectSubset<T, databank_chunksFindFirstArgs<ExtArgs>>): Prisma__databank_chunksClient<$Result.GetResult<Prisma.$databank_chunksPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Databank_chunks that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {databank_chunksFindFirstOrThrowArgs} args - Arguments to find a Databank_chunks
     * @example
     * // Get one Databank_chunks
     * const databank_chunks = await prisma.databank_chunks.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends databank_chunksFindFirstOrThrowArgs>(args?: SelectSubset<T, databank_chunksFindFirstOrThrowArgs<ExtArgs>>): Prisma__databank_chunksClient<$Result.GetResult<Prisma.$databank_chunksPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Databank_chunks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {databank_chunksFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Databank_chunks
     * const databank_chunks = await prisma.databank_chunks.findMany()
     * 
     * // Get first 10 Databank_chunks
     * const databank_chunks = await prisma.databank_chunks.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const databank_chunksWithIdOnly = await prisma.databank_chunks.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends databank_chunksFindManyArgs>(args?: SelectSubset<T, databank_chunksFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$databank_chunksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Databank_chunks.
     * @param {databank_chunksCreateArgs} args - Arguments to create a Databank_chunks.
     * @example
     * // Create one Databank_chunks
     * const Databank_chunks = await prisma.databank_chunks.create({
     *   data: {
     *     // ... data to create a Databank_chunks
     *   }
     * })
     * 
     */
    create<T extends databank_chunksCreateArgs>(args: SelectSubset<T, databank_chunksCreateArgs<ExtArgs>>): Prisma__databank_chunksClient<$Result.GetResult<Prisma.$databank_chunksPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Databank_chunks.
     * @param {databank_chunksCreateManyArgs} args - Arguments to create many Databank_chunks.
     * @example
     * // Create many Databank_chunks
     * const databank_chunks = await prisma.databank_chunks.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends databank_chunksCreateManyArgs>(args?: SelectSubset<T, databank_chunksCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Databank_chunks and returns the data saved in the database.
     * @param {databank_chunksCreateManyAndReturnArgs} args - Arguments to create many Databank_chunks.
     * @example
     * // Create many Databank_chunks
     * const databank_chunks = await prisma.databank_chunks.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Databank_chunks and only return the `id`
     * const databank_chunksWithIdOnly = await prisma.databank_chunks.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends databank_chunksCreateManyAndReturnArgs>(args?: SelectSubset<T, databank_chunksCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$databank_chunksPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Databank_chunks.
     * @param {databank_chunksDeleteArgs} args - Arguments to delete one Databank_chunks.
     * @example
     * // Delete one Databank_chunks
     * const Databank_chunks = await prisma.databank_chunks.delete({
     *   where: {
     *     // ... filter to delete one Databank_chunks
     *   }
     * })
     * 
     */
    delete<T extends databank_chunksDeleteArgs>(args: SelectSubset<T, databank_chunksDeleteArgs<ExtArgs>>): Prisma__databank_chunksClient<$Result.GetResult<Prisma.$databank_chunksPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Databank_chunks.
     * @param {databank_chunksUpdateArgs} args - Arguments to update one Databank_chunks.
     * @example
     * // Update one Databank_chunks
     * const databank_chunks = await prisma.databank_chunks.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends databank_chunksUpdateArgs>(args: SelectSubset<T, databank_chunksUpdateArgs<ExtArgs>>): Prisma__databank_chunksClient<$Result.GetResult<Prisma.$databank_chunksPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Databank_chunks.
     * @param {databank_chunksDeleteManyArgs} args - Arguments to filter Databank_chunks to delete.
     * @example
     * // Delete a few Databank_chunks
     * const { count } = await prisma.databank_chunks.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends databank_chunksDeleteManyArgs>(args?: SelectSubset<T, databank_chunksDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Databank_chunks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {databank_chunksUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Databank_chunks
     * const databank_chunks = await prisma.databank_chunks.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends databank_chunksUpdateManyArgs>(args: SelectSubset<T, databank_chunksUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Databank_chunks and returns the data updated in the database.
     * @param {databank_chunksUpdateManyAndReturnArgs} args - Arguments to update many Databank_chunks.
     * @example
     * // Update many Databank_chunks
     * const databank_chunks = await prisma.databank_chunks.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Databank_chunks and only return the `id`
     * const databank_chunksWithIdOnly = await prisma.databank_chunks.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends databank_chunksUpdateManyAndReturnArgs>(args: SelectSubset<T, databank_chunksUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$databank_chunksPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Databank_chunks.
     * @param {databank_chunksUpsertArgs} args - Arguments to update or create a Databank_chunks.
     * @example
     * // Update or create a Databank_chunks
     * const databank_chunks = await prisma.databank_chunks.upsert({
     *   create: {
     *     // ... data to create a Databank_chunks
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Databank_chunks we want to update
     *   }
     * })
     */
    upsert<T extends databank_chunksUpsertArgs>(args: SelectSubset<T, databank_chunksUpsertArgs<ExtArgs>>): Prisma__databank_chunksClient<$Result.GetResult<Prisma.$databank_chunksPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Databank_chunks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {databank_chunksCountArgs} args - Arguments to filter Databank_chunks to count.
     * @example
     * // Count the number of Databank_chunks
     * const count = await prisma.databank_chunks.count({
     *   where: {
     *     // ... the filter for the Databank_chunks we want to count
     *   }
     * })
    **/
    count<T extends databank_chunksCountArgs>(
      args?: Subset<T, databank_chunksCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Databank_chunksCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Databank_chunks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Databank_chunksAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Databank_chunksAggregateArgs>(args: Subset<T, Databank_chunksAggregateArgs>): Prisma.PrismaPromise<GetDatabank_chunksAggregateType<T>>

    /**
     * Group by Databank_chunks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {databank_chunksGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends databank_chunksGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: databank_chunksGroupByArgs['orderBy'] }
        : { orderBy?: databank_chunksGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, databank_chunksGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDatabank_chunksGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the databank_chunks model
   */
  readonly fields: databank_chunksFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for databank_chunks.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__databank_chunksClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the databank_chunks model
   */
  interface databank_chunksFieldRefs {
    readonly id: FieldRef<"databank_chunks", 'String'>
    readonly document_id: FieldRef<"databank_chunks", 'String'>
    readonly content: FieldRef<"databank_chunks", 'String'>
    readonly page_number: FieldRef<"databank_chunks", 'Int'>
    readonly chunk_index: FieldRef<"databank_chunks", 'Int'>
    readonly token_count: FieldRef<"databank_chunks", 'Int'>
    readonly created_at: FieldRef<"databank_chunks", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * databank_chunks findUnique
   */
  export type databank_chunksFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_chunks
     */
    select?: databank_chunksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_chunks
     */
    omit?: databank_chunksOmit<ExtArgs> | null
    /**
     * Filter, which databank_chunks to fetch.
     */
    where: databank_chunksWhereUniqueInput
  }

  /**
   * databank_chunks findUniqueOrThrow
   */
  export type databank_chunksFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_chunks
     */
    select?: databank_chunksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_chunks
     */
    omit?: databank_chunksOmit<ExtArgs> | null
    /**
     * Filter, which databank_chunks to fetch.
     */
    where: databank_chunksWhereUniqueInput
  }

  /**
   * databank_chunks findFirst
   */
  export type databank_chunksFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_chunks
     */
    select?: databank_chunksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_chunks
     */
    omit?: databank_chunksOmit<ExtArgs> | null
    /**
     * Filter, which databank_chunks to fetch.
     */
    where?: databank_chunksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of databank_chunks to fetch.
     */
    orderBy?: databank_chunksOrderByWithRelationInput | databank_chunksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for databank_chunks.
     */
    cursor?: databank_chunksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` databank_chunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` databank_chunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of databank_chunks.
     */
    distinct?: Databank_chunksScalarFieldEnum | Databank_chunksScalarFieldEnum[]
  }

  /**
   * databank_chunks findFirstOrThrow
   */
  export type databank_chunksFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_chunks
     */
    select?: databank_chunksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_chunks
     */
    omit?: databank_chunksOmit<ExtArgs> | null
    /**
     * Filter, which databank_chunks to fetch.
     */
    where?: databank_chunksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of databank_chunks to fetch.
     */
    orderBy?: databank_chunksOrderByWithRelationInput | databank_chunksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for databank_chunks.
     */
    cursor?: databank_chunksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` databank_chunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` databank_chunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of databank_chunks.
     */
    distinct?: Databank_chunksScalarFieldEnum | Databank_chunksScalarFieldEnum[]
  }

  /**
   * databank_chunks findMany
   */
  export type databank_chunksFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_chunks
     */
    select?: databank_chunksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_chunks
     */
    omit?: databank_chunksOmit<ExtArgs> | null
    /**
     * Filter, which databank_chunks to fetch.
     */
    where?: databank_chunksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of databank_chunks to fetch.
     */
    orderBy?: databank_chunksOrderByWithRelationInput | databank_chunksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing databank_chunks.
     */
    cursor?: databank_chunksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` databank_chunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` databank_chunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of databank_chunks.
     */
    distinct?: Databank_chunksScalarFieldEnum | Databank_chunksScalarFieldEnum[]
  }

  /**
   * databank_chunks create
   */
  export type databank_chunksCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_chunks
     */
    select?: databank_chunksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_chunks
     */
    omit?: databank_chunksOmit<ExtArgs> | null
    /**
     * The data needed to create a databank_chunks.
     */
    data: XOR<databank_chunksCreateInput, databank_chunksUncheckedCreateInput>
  }

  /**
   * databank_chunks createMany
   */
  export type databank_chunksCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many databank_chunks.
     */
    data: databank_chunksCreateManyInput | databank_chunksCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * databank_chunks createManyAndReturn
   */
  export type databank_chunksCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_chunks
     */
    select?: databank_chunksSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the databank_chunks
     */
    omit?: databank_chunksOmit<ExtArgs> | null
    /**
     * The data used to create many databank_chunks.
     */
    data: databank_chunksCreateManyInput | databank_chunksCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * databank_chunks update
   */
  export type databank_chunksUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_chunks
     */
    select?: databank_chunksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_chunks
     */
    omit?: databank_chunksOmit<ExtArgs> | null
    /**
     * The data needed to update a databank_chunks.
     */
    data: XOR<databank_chunksUpdateInput, databank_chunksUncheckedUpdateInput>
    /**
     * Choose, which databank_chunks to update.
     */
    where: databank_chunksWhereUniqueInput
  }

  /**
   * databank_chunks updateMany
   */
  export type databank_chunksUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update databank_chunks.
     */
    data: XOR<databank_chunksUpdateManyMutationInput, databank_chunksUncheckedUpdateManyInput>
    /**
     * Filter which databank_chunks to update
     */
    where?: databank_chunksWhereInput
    /**
     * Limit how many databank_chunks to update.
     */
    limit?: number
  }

  /**
   * databank_chunks updateManyAndReturn
   */
  export type databank_chunksUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_chunks
     */
    select?: databank_chunksSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the databank_chunks
     */
    omit?: databank_chunksOmit<ExtArgs> | null
    /**
     * The data used to update databank_chunks.
     */
    data: XOR<databank_chunksUpdateManyMutationInput, databank_chunksUncheckedUpdateManyInput>
    /**
     * Filter which databank_chunks to update
     */
    where?: databank_chunksWhereInput
    /**
     * Limit how many databank_chunks to update.
     */
    limit?: number
  }

  /**
   * databank_chunks upsert
   */
  export type databank_chunksUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_chunks
     */
    select?: databank_chunksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_chunks
     */
    omit?: databank_chunksOmit<ExtArgs> | null
    /**
     * The filter to search for the databank_chunks to update in case it exists.
     */
    where: databank_chunksWhereUniqueInput
    /**
     * In case the databank_chunks found by the `where` argument doesn't exist, create a new databank_chunks with this data.
     */
    create: XOR<databank_chunksCreateInput, databank_chunksUncheckedCreateInput>
    /**
     * In case the databank_chunks was found with the provided `where` argument, update it with this data.
     */
    update: XOR<databank_chunksUpdateInput, databank_chunksUncheckedUpdateInput>
  }

  /**
   * databank_chunks delete
   */
  export type databank_chunksDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_chunks
     */
    select?: databank_chunksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_chunks
     */
    omit?: databank_chunksOmit<ExtArgs> | null
    /**
     * Filter which databank_chunks to delete.
     */
    where: databank_chunksWhereUniqueInput
  }

  /**
   * databank_chunks deleteMany
   */
  export type databank_chunksDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which databank_chunks to delete
     */
    where?: databank_chunksWhereInput
    /**
     * Limit how many databank_chunks to delete.
     */
    limit?: number
  }

  /**
   * databank_chunks without action
   */
  export type databank_chunksDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_chunks
     */
    select?: databank_chunksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_chunks
     */
    omit?: databank_chunksOmit<ExtArgs> | null
  }


  /**
   * Model databank_documents
   */

  export type AggregateDatabank_documents = {
    _count: Databank_documentsCountAggregateOutputType | null
    _avg: Databank_documentsAvgAggregateOutputType | null
    _sum: Databank_documentsSumAggregateOutputType | null
    _min: Databank_documentsMinAggregateOutputType | null
    _max: Databank_documentsMaxAggregateOutputType | null
  }

  export type Databank_documentsAvgAggregateOutputType = {
    file_size: number | null
    page_count: number | null
    chunk_count: number | null
  }

  export type Databank_documentsSumAggregateOutputType = {
    file_size: number | null
    page_count: number | null
    chunk_count: number | null
  }

  export type Databank_documentsMinAggregateOutputType = {
    id: string | null
    title: string | null
    doc_type: string | null
    topic_id: string | null
    file_path: string | null
    file_name: string | null
    file_size: number | null
    page_count: number | null
    chunk_count: number | null
    processing_status: string | null
    processing_error: string | null
    created_at: Date | null
    updated_at: Date | null
    subject_id: string | null
  }

  export type Databank_documentsMaxAggregateOutputType = {
    id: string | null
    title: string | null
    doc_type: string | null
    topic_id: string | null
    file_path: string | null
    file_name: string | null
    file_size: number | null
    page_count: number | null
    chunk_count: number | null
    processing_status: string | null
    processing_error: string | null
    created_at: Date | null
    updated_at: Date | null
    subject_id: string | null
  }

  export type Databank_documentsCountAggregateOutputType = {
    id: number
    title: number
    doc_type: number
    topic_id: number
    file_path: number
    file_name: number
    file_size: number
    page_count: number
    chunk_count: number
    processing_status: number
    processing_error: number
    created_at: number
    updated_at: number
    subject_id: number
    _all: number
  }


  export type Databank_documentsAvgAggregateInputType = {
    file_size?: true
    page_count?: true
    chunk_count?: true
  }

  export type Databank_documentsSumAggregateInputType = {
    file_size?: true
    page_count?: true
    chunk_count?: true
  }

  export type Databank_documentsMinAggregateInputType = {
    id?: true
    title?: true
    doc_type?: true
    topic_id?: true
    file_path?: true
    file_name?: true
    file_size?: true
    page_count?: true
    chunk_count?: true
    processing_status?: true
    processing_error?: true
    created_at?: true
    updated_at?: true
    subject_id?: true
  }

  export type Databank_documentsMaxAggregateInputType = {
    id?: true
    title?: true
    doc_type?: true
    topic_id?: true
    file_path?: true
    file_name?: true
    file_size?: true
    page_count?: true
    chunk_count?: true
    processing_status?: true
    processing_error?: true
    created_at?: true
    updated_at?: true
    subject_id?: true
  }

  export type Databank_documentsCountAggregateInputType = {
    id?: true
    title?: true
    doc_type?: true
    topic_id?: true
    file_path?: true
    file_name?: true
    file_size?: true
    page_count?: true
    chunk_count?: true
    processing_status?: true
    processing_error?: true
    created_at?: true
    updated_at?: true
    subject_id?: true
    _all?: true
  }

  export type Databank_documentsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which databank_documents to aggregate.
     */
    where?: databank_documentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of databank_documents to fetch.
     */
    orderBy?: databank_documentsOrderByWithRelationInput | databank_documentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: databank_documentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` databank_documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` databank_documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned databank_documents
    **/
    _count?: true | Databank_documentsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Databank_documentsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Databank_documentsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Databank_documentsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Databank_documentsMaxAggregateInputType
  }

  export type GetDatabank_documentsAggregateType<T extends Databank_documentsAggregateArgs> = {
        [P in keyof T & keyof AggregateDatabank_documents]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDatabank_documents[P]>
      : GetScalarType<T[P], AggregateDatabank_documents[P]>
  }




  export type databank_documentsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: databank_documentsWhereInput
    orderBy?: databank_documentsOrderByWithAggregationInput | databank_documentsOrderByWithAggregationInput[]
    by: Databank_documentsScalarFieldEnum[] | Databank_documentsScalarFieldEnum
    having?: databank_documentsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Databank_documentsCountAggregateInputType | true
    _avg?: Databank_documentsAvgAggregateInputType
    _sum?: Databank_documentsSumAggregateInputType
    _min?: Databank_documentsMinAggregateInputType
    _max?: Databank_documentsMaxAggregateInputType
  }

  export type Databank_documentsGroupByOutputType = {
    id: string
    title: string
    doc_type: string
    topic_id: string | null
    file_path: string
    file_name: string
    file_size: number | null
    page_count: number | null
    chunk_count: number | null
    processing_status: string
    processing_error: string | null
    created_at: Date | null
    updated_at: Date | null
    subject_id: string | null
    _count: Databank_documentsCountAggregateOutputType | null
    _avg: Databank_documentsAvgAggregateOutputType | null
    _sum: Databank_documentsSumAggregateOutputType | null
    _min: Databank_documentsMinAggregateOutputType | null
    _max: Databank_documentsMaxAggregateOutputType | null
  }

  type GetDatabank_documentsGroupByPayload<T extends databank_documentsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Databank_documentsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Databank_documentsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Databank_documentsGroupByOutputType[P]>
            : GetScalarType<T[P], Databank_documentsGroupByOutputType[P]>
        }
      >
    >


  export type databank_documentsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    doc_type?: boolean
    topic_id?: boolean
    file_path?: boolean
    file_name?: boolean
    file_size?: boolean
    page_count?: boolean
    chunk_count?: boolean
    processing_status?: boolean
    processing_error?: boolean
    created_at?: boolean
    updated_at?: boolean
    subject_id?: boolean
  }, ExtArgs["result"]["databank_documents"]>

  export type databank_documentsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    doc_type?: boolean
    topic_id?: boolean
    file_path?: boolean
    file_name?: boolean
    file_size?: boolean
    page_count?: boolean
    chunk_count?: boolean
    processing_status?: boolean
    processing_error?: boolean
    created_at?: boolean
    updated_at?: boolean
    subject_id?: boolean
  }, ExtArgs["result"]["databank_documents"]>

  export type databank_documentsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    doc_type?: boolean
    topic_id?: boolean
    file_path?: boolean
    file_name?: boolean
    file_size?: boolean
    page_count?: boolean
    chunk_count?: boolean
    processing_status?: boolean
    processing_error?: boolean
    created_at?: boolean
    updated_at?: boolean
    subject_id?: boolean
  }, ExtArgs["result"]["databank_documents"]>

  export type databank_documentsSelectScalar = {
    id?: boolean
    title?: boolean
    doc_type?: boolean
    topic_id?: boolean
    file_path?: boolean
    file_name?: boolean
    file_size?: boolean
    page_count?: boolean
    chunk_count?: boolean
    processing_status?: boolean
    processing_error?: boolean
    created_at?: boolean
    updated_at?: boolean
    subject_id?: boolean
  }

  export type databank_documentsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "doc_type" | "topic_id" | "file_path" | "file_name" | "file_size" | "page_count" | "chunk_count" | "processing_status" | "processing_error" | "created_at" | "updated_at" | "subject_id", ExtArgs["result"]["databank_documents"]>

  export type $databank_documentsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "databank_documents"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      doc_type: string
      topic_id: string | null
      file_path: string
      file_name: string
      file_size: number | null
      page_count: number | null
      chunk_count: number | null
      processing_status: string
      processing_error: string | null
      created_at: Date | null
      updated_at: Date | null
      subject_id: string | null
    }, ExtArgs["result"]["databank_documents"]>
    composites: {}
  }

  type databank_documentsGetPayload<S extends boolean | null | undefined | databank_documentsDefaultArgs> = $Result.GetResult<Prisma.$databank_documentsPayload, S>

  type databank_documentsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<databank_documentsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Databank_documentsCountAggregateInputType | true
    }

  export interface databank_documentsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['databank_documents'], meta: { name: 'databank_documents' } }
    /**
     * Find zero or one Databank_documents that matches the filter.
     * @param {databank_documentsFindUniqueArgs} args - Arguments to find a Databank_documents
     * @example
     * // Get one Databank_documents
     * const databank_documents = await prisma.databank_documents.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends databank_documentsFindUniqueArgs>(args: SelectSubset<T, databank_documentsFindUniqueArgs<ExtArgs>>): Prisma__databank_documentsClient<$Result.GetResult<Prisma.$databank_documentsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Databank_documents that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {databank_documentsFindUniqueOrThrowArgs} args - Arguments to find a Databank_documents
     * @example
     * // Get one Databank_documents
     * const databank_documents = await prisma.databank_documents.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends databank_documentsFindUniqueOrThrowArgs>(args: SelectSubset<T, databank_documentsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__databank_documentsClient<$Result.GetResult<Prisma.$databank_documentsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Databank_documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {databank_documentsFindFirstArgs} args - Arguments to find a Databank_documents
     * @example
     * // Get one Databank_documents
     * const databank_documents = await prisma.databank_documents.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends databank_documentsFindFirstArgs>(args?: SelectSubset<T, databank_documentsFindFirstArgs<ExtArgs>>): Prisma__databank_documentsClient<$Result.GetResult<Prisma.$databank_documentsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Databank_documents that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {databank_documentsFindFirstOrThrowArgs} args - Arguments to find a Databank_documents
     * @example
     * // Get one Databank_documents
     * const databank_documents = await prisma.databank_documents.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends databank_documentsFindFirstOrThrowArgs>(args?: SelectSubset<T, databank_documentsFindFirstOrThrowArgs<ExtArgs>>): Prisma__databank_documentsClient<$Result.GetResult<Prisma.$databank_documentsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Databank_documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {databank_documentsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Databank_documents
     * const databank_documents = await prisma.databank_documents.findMany()
     * 
     * // Get first 10 Databank_documents
     * const databank_documents = await prisma.databank_documents.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const databank_documentsWithIdOnly = await prisma.databank_documents.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends databank_documentsFindManyArgs>(args?: SelectSubset<T, databank_documentsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$databank_documentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Databank_documents.
     * @param {databank_documentsCreateArgs} args - Arguments to create a Databank_documents.
     * @example
     * // Create one Databank_documents
     * const Databank_documents = await prisma.databank_documents.create({
     *   data: {
     *     // ... data to create a Databank_documents
     *   }
     * })
     * 
     */
    create<T extends databank_documentsCreateArgs>(args: SelectSubset<T, databank_documentsCreateArgs<ExtArgs>>): Prisma__databank_documentsClient<$Result.GetResult<Prisma.$databank_documentsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Databank_documents.
     * @param {databank_documentsCreateManyArgs} args - Arguments to create many Databank_documents.
     * @example
     * // Create many Databank_documents
     * const databank_documents = await prisma.databank_documents.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends databank_documentsCreateManyArgs>(args?: SelectSubset<T, databank_documentsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Databank_documents and returns the data saved in the database.
     * @param {databank_documentsCreateManyAndReturnArgs} args - Arguments to create many Databank_documents.
     * @example
     * // Create many Databank_documents
     * const databank_documents = await prisma.databank_documents.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Databank_documents and only return the `id`
     * const databank_documentsWithIdOnly = await prisma.databank_documents.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends databank_documentsCreateManyAndReturnArgs>(args?: SelectSubset<T, databank_documentsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$databank_documentsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Databank_documents.
     * @param {databank_documentsDeleteArgs} args - Arguments to delete one Databank_documents.
     * @example
     * // Delete one Databank_documents
     * const Databank_documents = await prisma.databank_documents.delete({
     *   where: {
     *     // ... filter to delete one Databank_documents
     *   }
     * })
     * 
     */
    delete<T extends databank_documentsDeleteArgs>(args: SelectSubset<T, databank_documentsDeleteArgs<ExtArgs>>): Prisma__databank_documentsClient<$Result.GetResult<Prisma.$databank_documentsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Databank_documents.
     * @param {databank_documentsUpdateArgs} args - Arguments to update one Databank_documents.
     * @example
     * // Update one Databank_documents
     * const databank_documents = await prisma.databank_documents.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends databank_documentsUpdateArgs>(args: SelectSubset<T, databank_documentsUpdateArgs<ExtArgs>>): Prisma__databank_documentsClient<$Result.GetResult<Prisma.$databank_documentsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Databank_documents.
     * @param {databank_documentsDeleteManyArgs} args - Arguments to filter Databank_documents to delete.
     * @example
     * // Delete a few Databank_documents
     * const { count } = await prisma.databank_documents.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends databank_documentsDeleteManyArgs>(args?: SelectSubset<T, databank_documentsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Databank_documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {databank_documentsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Databank_documents
     * const databank_documents = await prisma.databank_documents.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends databank_documentsUpdateManyArgs>(args: SelectSubset<T, databank_documentsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Databank_documents and returns the data updated in the database.
     * @param {databank_documentsUpdateManyAndReturnArgs} args - Arguments to update many Databank_documents.
     * @example
     * // Update many Databank_documents
     * const databank_documents = await prisma.databank_documents.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Databank_documents and only return the `id`
     * const databank_documentsWithIdOnly = await prisma.databank_documents.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends databank_documentsUpdateManyAndReturnArgs>(args: SelectSubset<T, databank_documentsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$databank_documentsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Databank_documents.
     * @param {databank_documentsUpsertArgs} args - Arguments to update or create a Databank_documents.
     * @example
     * // Update or create a Databank_documents
     * const databank_documents = await prisma.databank_documents.upsert({
     *   create: {
     *     // ... data to create a Databank_documents
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Databank_documents we want to update
     *   }
     * })
     */
    upsert<T extends databank_documentsUpsertArgs>(args: SelectSubset<T, databank_documentsUpsertArgs<ExtArgs>>): Prisma__databank_documentsClient<$Result.GetResult<Prisma.$databank_documentsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Databank_documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {databank_documentsCountArgs} args - Arguments to filter Databank_documents to count.
     * @example
     * // Count the number of Databank_documents
     * const count = await prisma.databank_documents.count({
     *   where: {
     *     // ... the filter for the Databank_documents we want to count
     *   }
     * })
    **/
    count<T extends databank_documentsCountArgs>(
      args?: Subset<T, databank_documentsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Databank_documentsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Databank_documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Databank_documentsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Databank_documentsAggregateArgs>(args: Subset<T, Databank_documentsAggregateArgs>): Prisma.PrismaPromise<GetDatabank_documentsAggregateType<T>>

    /**
     * Group by Databank_documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {databank_documentsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends databank_documentsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: databank_documentsGroupByArgs['orderBy'] }
        : { orderBy?: databank_documentsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, databank_documentsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDatabank_documentsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the databank_documents model
   */
  readonly fields: databank_documentsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for databank_documents.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__databank_documentsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the databank_documents model
   */
  interface databank_documentsFieldRefs {
    readonly id: FieldRef<"databank_documents", 'String'>
    readonly title: FieldRef<"databank_documents", 'String'>
    readonly doc_type: FieldRef<"databank_documents", 'String'>
    readonly topic_id: FieldRef<"databank_documents", 'String'>
    readonly file_path: FieldRef<"databank_documents", 'String'>
    readonly file_name: FieldRef<"databank_documents", 'String'>
    readonly file_size: FieldRef<"databank_documents", 'Int'>
    readonly page_count: FieldRef<"databank_documents", 'Int'>
    readonly chunk_count: FieldRef<"databank_documents", 'Int'>
    readonly processing_status: FieldRef<"databank_documents", 'String'>
    readonly processing_error: FieldRef<"databank_documents", 'String'>
    readonly created_at: FieldRef<"databank_documents", 'DateTime'>
    readonly updated_at: FieldRef<"databank_documents", 'DateTime'>
    readonly subject_id: FieldRef<"databank_documents", 'String'>
  }
    

  // Custom InputTypes
  /**
   * databank_documents findUnique
   */
  export type databank_documentsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_documents
     */
    select?: databank_documentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_documents
     */
    omit?: databank_documentsOmit<ExtArgs> | null
    /**
     * Filter, which databank_documents to fetch.
     */
    where: databank_documentsWhereUniqueInput
  }

  /**
   * databank_documents findUniqueOrThrow
   */
  export type databank_documentsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_documents
     */
    select?: databank_documentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_documents
     */
    omit?: databank_documentsOmit<ExtArgs> | null
    /**
     * Filter, which databank_documents to fetch.
     */
    where: databank_documentsWhereUniqueInput
  }

  /**
   * databank_documents findFirst
   */
  export type databank_documentsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_documents
     */
    select?: databank_documentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_documents
     */
    omit?: databank_documentsOmit<ExtArgs> | null
    /**
     * Filter, which databank_documents to fetch.
     */
    where?: databank_documentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of databank_documents to fetch.
     */
    orderBy?: databank_documentsOrderByWithRelationInput | databank_documentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for databank_documents.
     */
    cursor?: databank_documentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` databank_documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` databank_documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of databank_documents.
     */
    distinct?: Databank_documentsScalarFieldEnum | Databank_documentsScalarFieldEnum[]
  }

  /**
   * databank_documents findFirstOrThrow
   */
  export type databank_documentsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_documents
     */
    select?: databank_documentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_documents
     */
    omit?: databank_documentsOmit<ExtArgs> | null
    /**
     * Filter, which databank_documents to fetch.
     */
    where?: databank_documentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of databank_documents to fetch.
     */
    orderBy?: databank_documentsOrderByWithRelationInput | databank_documentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for databank_documents.
     */
    cursor?: databank_documentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` databank_documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` databank_documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of databank_documents.
     */
    distinct?: Databank_documentsScalarFieldEnum | Databank_documentsScalarFieldEnum[]
  }

  /**
   * databank_documents findMany
   */
  export type databank_documentsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_documents
     */
    select?: databank_documentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_documents
     */
    omit?: databank_documentsOmit<ExtArgs> | null
    /**
     * Filter, which databank_documents to fetch.
     */
    where?: databank_documentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of databank_documents to fetch.
     */
    orderBy?: databank_documentsOrderByWithRelationInput | databank_documentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing databank_documents.
     */
    cursor?: databank_documentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` databank_documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` databank_documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of databank_documents.
     */
    distinct?: Databank_documentsScalarFieldEnum | Databank_documentsScalarFieldEnum[]
  }

  /**
   * databank_documents create
   */
  export type databank_documentsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_documents
     */
    select?: databank_documentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_documents
     */
    omit?: databank_documentsOmit<ExtArgs> | null
    /**
     * The data needed to create a databank_documents.
     */
    data: XOR<databank_documentsCreateInput, databank_documentsUncheckedCreateInput>
  }

  /**
   * databank_documents createMany
   */
  export type databank_documentsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many databank_documents.
     */
    data: databank_documentsCreateManyInput | databank_documentsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * databank_documents createManyAndReturn
   */
  export type databank_documentsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_documents
     */
    select?: databank_documentsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the databank_documents
     */
    omit?: databank_documentsOmit<ExtArgs> | null
    /**
     * The data used to create many databank_documents.
     */
    data: databank_documentsCreateManyInput | databank_documentsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * databank_documents update
   */
  export type databank_documentsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_documents
     */
    select?: databank_documentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_documents
     */
    omit?: databank_documentsOmit<ExtArgs> | null
    /**
     * The data needed to update a databank_documents.
     */
    data: XOR<databank_documentsUpdateInput, databank_documentsUncheckedUpdateInput>
    /**
     * Choose, which databank_documents to update.
     */
    where: databank_documentsWhereUniqueInput
  }

  /**
   * databank_documents updateMany
   */
  export type databank_documentsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update databank_documents.
     */
    data: XOR<databank_documentsUpdateManyMutationInput, databank_documentsUncheckedUpdateManyInput>
    /**
     * Filter which databank_documents to update
     */
    where?: databank_documentsWhereInput
    /**
     * Limit how many databank_documents to update.
     */
    limit?: number
  }

  /**
   * databank_documents updateManyAndReturn
   */
  export type databank_documentsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_documents
     */
    select?: databank_documentsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the databank_documents
     */
    omit?: databank_documentsOmit<ExtArgs> | null
    /**
     * The data used to update databank_documents.
     */
    data: XOR<databank_documentsUpdateManyMutationInput, databank_documentsUncheckedUpdateManyInput>
    /**
     * Filter which databank_documents to update
     */
    where?: databank_documentsWhereInput
    /**
     * Limit how many databank_documents to update.
     */
    limit?: number
  }

  /**
   * databank_documents upsert
   */
  export type databank_documentsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_documents
     */
    select?: databank_documentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_documents
     */
    omit?: databank_documentsOmit<ExtArgs> | null
    /**
     * The filter to search for the databank_documents to update in case it exists.
     */
    where: databank_documentsWhereUniqueInput
    /**
     * In case the databank_documents found by the `where` argument doesn't exist, create a new databank_documents with this data.
     */
    create: XOR<databank_documentsCreateInput, databank_documentsUncheckedCreateInput>
    /**
     * In case the databank_documents was found with the provided `where` argument, update it with this data.
     */
    update: XOR<databank_documentsUpdateInput, databank_documentsUncheckedUpdateInput>
  }

  /**
   * databank_documents delete
   */
  export type databank_documentsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_documents
     */
    select?: databank_documentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_documents
     */
    omit?: databank_documentsOmit<ExtArgs> | null
    /**
     * Filter which databank_documents to delete.
     */
    where: databank_documentsWhereUniqueInput
  }

  /**
   * databank_documents deleteMany
   */
  export type databank_documentsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which databank_documents to delete
     */
    where?: databank_documentsWhereInput
    /**
     * Limit how many databank_documents to delete.
     */
    limit?: number
  }

  /**
   * databank_documents without action
   */
  export type databank_documentsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the databank_documents
     */
    select?: databank_documentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the databank_documents
     */
    omit?: databank_documentsOmit<ExtArgs> | null
  }


  /**
   * Model exam_boards
   */

  export type AggregateExam_boards = {
    _count: Exam_boardsCountAggregateOutputType | null
    _min: Exam_boardsMinAggregateOutputType | null
    _max: Exam_boardsMaxAggregateOutputType | null
  }

  export type Exam_boardsMinAggregateOutputType = {
    id: string | null
    name: string | null
    created_at: Date | null
  }

  export type Exam_boardsMaxAggregateOutputType = {
    id: string | null
    name: string | null
    created_at: Date | null
  }

  export type Exam_boardsCountAggregateOutputType = {
    id: number
    name: number
    created_at: number
    _all: number
  }


  export type Exam_boardsMinAggregateInputType = {
    id?: true
    name?: true
    created_at?: true
  }

  export type Exam_boardsMaxAggregateInputType = {
    id?: true
    name?: true
    created_at?: true
  }

  export type Exam_boardsCountAggregateInputType = {
    id?: true
    name?: true
    created_at?: true
    _all?: true
  }

  export type Exam_boardsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which exam_boards to aggregate.
     */
    where?: exam_boardsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of exam_boards to fetch.
     */
    orderBy?: exam_boardsOrderByWithRelationInput | exam_boardsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: exam_boardsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` exam_boards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` exam_boards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned exam_boards
    **/
    _count?: true | Exam_boardsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Exam_boardsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Exam_boardsMaxAggregateInputType
  }

  export type GetExam_boardsAggregateType<T extends Exam_boardsAggregateArgs> = {
        [P in keyof T & keyof AggregateExam_boards]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExam_boards[P]>
      : GetScalarType<T[P], AggregateExam_boards[P]>
  }




  export type exam_boardsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: exam_boardsWhereInput
    orderBy?: exam_boardsOrderByWithAggregationInput | exam_boardsOrderByWithAggregationInput[]
    by: Exam_boardsScalarFieldEnum[] | Exam_boardsScalarFieldEnum
    having?: exam_boardsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Exam_boardsCountAggregateInputType | true
    _min?: Exam_boardsMinAggregateInputType
    _max?: Exam_boardsMaxAggregateInputType
  }

  export type Exam_boardsGroupByOutputType = {
    id: string
    name: string
    created_at: Date
    _count: Exam_boardsCountAggregateOutputType | null
    _min: Exam_boardsMinAggregateOutputType | null
    _max: Exam_boardsMaxAggregateOutputType | null
  }

  type GetExam_boardsGroupByPayload<T extends exam_boardsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Exam_boardsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Exam_boardsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Exam_boardsGroupByOutputType[P]>
            : GetScalarType<T[P], Exam_boardsGroupByOutputType[P]>
        }
      >
    >


  export type exam_boardsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["exam_boards"]>

  export type exam_boardsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["exam_boards"]>

  export type exam_boardsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["exam_boards"]>

  export type exam_boardsSelectScalar = {
    id?: boolean
    name?: boolean
    created_at?: boolean
  }

  export type exam_boardsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "created_at", ExtArgs["result"]["exam_boards"]>

  export type $exam_boardsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "exam_boards"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      created_at: Date
    }, ExtArgs["result"]["exam_boards"]>
    composites: {}
  }

  type exam_boardsGetPayload<S extends boolean | null | undefined | exam_boardsDefaultArgs> = $Result.GetResult<Prisma.$exam_boardsPayload, S>

  type exam_boardsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<exam_boardsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Exam_boardsCountAggregateInputType | true
    }

  export interface exam_boardsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['exam_boards'], meta: { name: 'exam_boards' } }
    /**
     * Find zero or one Exam_boards that matches the filter.
     * @param {exam_boardsFindUniqueArgs} args - Arguments to find a Exam_boards
     * @example
     * // Get one Exam_boards
     * const exam_boards = await prisma.exam_boards.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends exam_boardsFindUniqueArgs>(args: SelectSubset<T, exam_boardsFindUniqueArgs<ExtArgs>>): Prisma__exam_boardsClient<$Result.GetResult<Prisma.$exam_boardsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Exam_boards that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {exam_boardsFindUniqueOrThrowArgs} args - Arguments to find a Exam_boards
     * @example
     * // Get one Exam_boards
     * const exam_boards = await prisma.exam_boards.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends exam_boardsFindUniqueOrThrowArgs>(args: SelectSubset<T, exam_boardsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__exam_boardsClient<$Result.GetResult<Prisma.$exam_boardsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Exam_boards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {exam_boardsFindFirstArgs} args - Arguments to find a Exam_boards
     * @example
     * // Get one Exam_boards
     * const exam_boards = await prisma.exam_boards.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends exam_boardsFindFirstArgs>(args?: SelectSubset<T, exam_boardsFindFirstArgs<ExtArgs>>): Prisma__exam_boardsClient<$Result.GetResult<Prisma.$exam_boardsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Exam_boards that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {exam_boardsFindFirstOrThrowArgs} args - Arguments to find a Exam_boards
     * @example
     * // Get one Exam_boards
     * const exam_boards = await prisma.exam_boards.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends exam_boardsFindFirstOrThrowArgs>(args?: SelectSubset<T, exam_boardsFindFirstOrThrowArgs<ExtArgs>>): Prisma__exam_boardsClient<$Result.GetResult<Prisma.$exam_boardsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Exam_boards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {exam_boardsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Exam_boards
     * const exam_boards = await prisma.exam_boards.findMany()
     * 
     * // Get first 10 Exam_boards
     * const exam_boards = await prisma.exam_boards.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const exam_boardsWithIdOnly = await prisma.exam_boards.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends exam_boardsFindManyArgs>(args?: SelectSubset<T, exam_boardsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$exam_boardsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Exam_boards.
     * @param {exam_boardsCreateArgs} args - Arguments to create a Exam_boards.
     * @example
     * // Create one Exam_boards
     * const Exam_boards = await prisma.exam_boards.create({
     *   data: {
     *     // ... data to create a Exam_boards
     *   }
     * })
     * 
     */
    create<T extends exam_boardsCreateArgs>(args: SelectSubset<T, exam_boardsCreateArgs<ExtArgs>>): Prisma__exam_boardsClient<$Result.GetResult<Prisma.$exam_boardsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Exam_boards.
     * @param {exam_boardsCreateManyArgs} args - Arguments to create many Exam_boards.
     * @example
     * // Create many Exam_boards
     * const exam_boards = await prisma.exam_boards.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends exam_boardsCreateManyArgs>(args?: SelectSubset<T, exam_boardsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Exam_boards and returns the data saved in the database.
     * @param {exam_boardsCreateManyAndReturnArgs} args - Arguments to create many Exam_boards.
     * @example
     * // Create many Exam_boards
     * const exam_boards = await prisma.exam_boards.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Exam_boards and only return the `id`
     * const exam_boardsWithIdOnly = await prisma.exam_boards.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends exam_boardsCreateManyAndReturnArgs>(args?: SelectSubset<T, exam_boardsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$exam_boardsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Exam_boards.
     * @param {exam_boardsDeleteArgs} args - Arguments to delete one Exam_boards.
     * @example
     * // Delete one Exam_boards
     * const Exam_boards = await prisma.exam_boards.delete({
     *   where: {
     *     // ... filter to delete one Exam_boards
     *   }
     * })
     * 
     */
    delete<T extends exam_boardsDeleteArgs>(args: SelectSubset<T, exam_boardsDeleteArgs<ExtArgs>>): Prisma__exam_boardsClient<$Result.GetResult<Prisma.$exam_boardsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Exam_boards.
     * @param {exam_boardsUpdateArgs} args - Arguments to update one Exam_boards.
     * @example
     * // Update one Exam_boards
     * const exam_boards = await prisma.exam_boards.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends exam_boardsUpdateArgs>(args: SelectSubset<T, exam_boardsUpdateArgs<ExtArgs>>): Prisma__exam_boardsClient<$Result.GetResult<Prisma.$exam_boardsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Exam_boards.
     * @param {exam_boardsDeleteManyArgs} args - Arguments to filter Exam_boards to delete.
     * @example
     * // Delete a few Exam_boards
     * const { count } = await prisma.exam_boards.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends exam_boardsDeleteManyArgs>(args?: SelectSubset<T, exam_boardsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Exam_boards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {exam_boardsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Exam_boards
     * const exam_boards = await prisma.exam_boards.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends exam_boardsUpdateManyArgs>(args: SelectSubset<T, exam_boardsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Exam_boards and returns the data updated in the database.
     * @param {exam_boardsUpdateManyAndReturnArgs} args - Arguments to update many Exam_boards.
     * @example
     * // Update many Exam_boards
     * const exam_boards = await prisma.exam_boards.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Exam_boards and only return the `id`
     * const exam_boardsWithIdOnly = await prisma.exam_boards.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends exam_boardsUpdateManyAndReturnArgs>(args: SelectSubset<T, exam_boardsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$exam_boardsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Exam_boards.
     * @param {exam_boardsUpsertArgs} args - Arguments to update or create a Exam_boards.
     * @example
     * // Update or create a Exam_boards
     * const exam_boards = await prisma.exam_boards.upsert({
     *   create: {
     *     // ... data to create a Exam_boards
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Exam_boards we want to update
     *   }
     * })
     */
    upsert<T extends exam_boardsUpsertArgs>(args: SelectSubset<T, exam_boardsUpsertArgs<ExtArgs>>): Prisma__exam_boardsClient<$Result.GetResult<Prisma.$exam_boardsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Exam_boards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {exam_boardsCountArgs} args - Arguments to filter Exam_boards to count.
     * @example
     * // Count the number of Exam_boards
     * const count = await prisma.exam_boards.count({
     *   where: {
     *     // ... the filter for the Exam_boards we want to count
     *   }
     * })
    **/
    count<T extends exam_boardsCountArgs>(
      args?: Subset<T, exam_boardsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Exam_boardsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Exam_boards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Exam_boardsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Exam_boardsAggregateArgs>(args: Subset<T, Exam_boardsAggregateArgs>): Prisma.PrismaPromise<GetExam_boardsAggregateType<T>>

    /**
     * Group by Exam_boards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {exam_boardsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends exam_boardsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: exam_boardsGroupByArgs['orderBy'] }
        : { orderBy?: exam_boardsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, exam_boardsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExam_boardsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the exam_boards model
   */
  readonly fields: exam_boardsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for exam_boards.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__exam_boardsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the exam_boards model
   */
  interface exam_boardsFieldRefs {
    readonly id: FieldRef<"exam_boards", 'String'>
    readonly name: FieldRef<"exam_boards", 'String'>
    readonly created_at: FieldRef<"exam_boards", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * exam_boards findUnique
   */
  export type exam_boardsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the exam_boards
     */
    select?: exam_boardsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the exam_boards
     */
    omit?: exam_boardsOmit<ExtArgs> | null
    /**
     * Filter, which exam_boards to fetch.
     */
    where: exam_boardsWhereUniqueInput
  }

  /**
   * exam_boards findUniqueOrThrow
   */
  export type exam_boardsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the exam_boards
     */
    select?: exam_boardsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the exam_boards
     */
    omit?: exam_boardsOmit<ExtArgs> | null
    /**
     * Filter, which exam_boards to fetch.
     */
    where: exam_boardsWhereUniqueInput
  }

  /**
   * exam_boards findFirst
   */
  export type exam_boardsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the exam_boards
     */
    select?: exam_boardsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the exam_boards
     */
    omit?: exam_boardsOmit<ExtArgs> | null
    /**
     * Filter, which exam_boards to fetch.
     */
    where?: exam_boardsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of exam_boards to fetch.
     */
    orderBy?: exam_boardsOrderByWithRelationInput | exam_boardsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for exam_boards.
     */
    cursor?: exam_boardsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` exam_boards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` exam_boards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of exam_boards.
     */
    distinct?: Exam_boardsScalarFieldEnum | Exam_boardsScalarFieldEnum[]
  }

  /**
   * exam_boards findFirstOrThrow
   */
  export type exam_boardsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the exam_boards
     */
    select?: exam_boardsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the exam_boards
     */
    omit?: exam_boardsOmit<ExtArgs> | null
    /**
     * Filter, which exam_boards to fetch.
     */
    where?: exam_boardsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of exam_boards to fetch.
     */
    orderBy?: exam_boardsOrderByWithRelationInput | exam_boardsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for exam_boards.
     */
    cursor?: exam_boardsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` exam_boards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` exam_boards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of exam_boards.
     */
    distinct?: Exam_boardsScalarFieldEnum | Exam_boardsScalarFieldEnum[]
  }

  /**
   * exam_boards findMany
   */
  export type exam_boardsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the exam_boards
     */
    select?: exam_boardsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the exam_boards
     */
    omit?: exam_boardsOmit<ExtArgs> | null
    /**
     * Filter, which exam_boards to fetch.
     */
    where?: exam_boardsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of exam_boards to fetch.
     */
    orderBy?: exam_boardsOrderByWithRelationInput | exam_boardsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing exam_boards.
     */
    cursor?: exam_boardsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` exam_boards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` exam_boards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of exam_boards.
     */
    distinct?: Exam_boardsScalarFieldEnum | Exam_boardsScalarFieldEnum[]
  }

  /**
   * exam_boards create
   */
  export type exam_boardsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the exam_boards
     */
    select?: exam_boardsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the exam_boards
     */
    omit?: exam_boardsOmit<ExtArgs> | null
    /**
     * The data needed to create a exam_boards.
     */
    data: XOR<exam_boardsCreateInput, exam_boardsUncheckedCreateInput>
  }

  /**
   * exam_boards createMany
   */
  export type exam_boardsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many exam_boards.
     */
    data: exam_boardsCreateManyInput | exam_boardsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * exam_boards createManyAndReturn
   */
  export type exam_boardsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the exam_boards
     */
    select?: exam_boardsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the exam_boards
     */
    omit?: exam_boardsOmit<ExtArgs> | null
    /**
     * The data used to create many exam_boards.
     */
    data: exam_boardsCreateManyInput | exam_boardsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * exam_boards update
   */
  export type exam_boardsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the exam_boards
     */
    select?: exam_boardsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the exam_boards
     */
    omit?: exam_boardsOmit<ExtArgs> | null
    /**
     * The data needed to update a exam_boards.
     */
    data: XOR<exam_boardsUpdateInput, exam_boardsUncheckedUpdateInput>
    /**
     * Choose, which exam_boards to update.
     */
    where: exam_boardsWhereUniqueInput
  }

  /**
   * exam_boards updateMany
   */
  export type exam_boardsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update exam_boards.
     */
    data: XOR<exam_boardsUpdateManyMutationInput, exam_boardsUncheckedUpdateManyInput>
    /**
     * Filter which exam_boards to update
     */
    where?: exam_boardsWhereInput
    /**
     * Limit how many exam_boards to update.
     */
    limit?: number
  }

  /**
   * exam_boards updateManyAndReturn
   */
  export type exam_boardsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the exam_boards
     */
    select?: exam_boardsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the exam_boards
     */
    omit?: exam_boardsOmit<ExtArgs> | null
    /**
     * The data used to update exam_boards.
     */
    data: XOR<exam_boardsUpdateManyMutationInput, exam_boardsUncheckedUpdateManyInput>
    /**
     * Filter which exam_boards to update
     */
    where?: exam_boardsWhereInput
    /**
     * Limit how many exam_boards to update.
     */
    limit?: number
  }

  /**
   * exam_boards upsert
   */
  export type exam_boardsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the exam_boards
     */
    select?: exam_boardsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the exam_boards
     */
    omit?: exam_boardsOmit<ExtArgs> | null
    /**
     * The filter to search for the exam_boards to update in case it exists.
     */
    where: exam_boardsWhereUniqueInput
    /**
     * In case the exam_boards found by the `where` argument doesn't exist, create a new exam_boards with this data.
     */
    create: XOR<exam_boardsCreateInput, exam_boardsUncheckedCreateInput>
    /**
     * In case the exam_boards was found with the provided `where` argument, update it with this data.
     */
    update: XOR<exam_boardsUpdateInput, exam_boardsUncheckedUpdateInput>
  }

  /**
   * exam_boards delete
   */
  export type exam_boardsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the exam_boards
     */
    select?: exam_boardsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the exam_boards
     */
    omit?: exam_boardsOmit<ExtArgs> | null
    /**
     * Filter which exam_boards to delete.
     */
    where: exam_boardsWhereUniqueInput
  }

  /**
   * exam_boards deleteMany
   */
  export type exam_boardsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which exam_boards to delete
     */
    where?: exam_boardsWhereInput
    /**
     * Limit how many exam_boards to delete.
     */
    limit?: number
  }

  /**
   * exam_boards without action
   */
  export type exam_boardsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the exam_boards
     */
    select?: exam_boardsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the exam_boards
     */
    omit?: exam_boardsOmit<ExtArgs> | null
  }


  /**
   * Model ppt_decks
   */

  export type AggregatePpt_decks = {
    _count: Ppt_decksCountAggregateOutputType | null
    _min: Ppt_decksMinAggregateOutputType | null
    _max: Ppt_decksMaxAggregateOutputType | null
  }

  export type Ppt_decksMinAggregateOutputType = {
    id: string | null
    title: string | null
    subtopic_id: string | null
    status: string | null
    created_by: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Ppt_decksMaxAggregateOutputType = {
    id: string | null
    title: string | null
    subtopic_id: string | null
    status: string | null
    created_by: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Ppt_decksCountAggregateOutputType = {
    id: number
    title: number
    subtopic_id: number
    status: number
    slides: number
    created_by: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Ppt_decksMinAggregateInputType = {
    id?: true
    title?: true
    subtopic_id?: true
    status?: true
    created_by?: true
    created_at?: true
    updated_at?: true
  }

  export type Ppt_decksMaxAggregateInputType = {
    id?: true
    title?: true
    subtopic_id?: true
    status?: true
    created_by?: true
    created_at?: true
    updated_at?: true
  }

  export type Ppt_decksCountAggregateInputType = {
    id?: true
    title?: true
    subtopic_id?: true
    status?: true
    slides?: true
    created_by?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Ppt_decksAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ppt_decks to aggregate.
     */
    where?: ppt_decksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ppt_decks to fetch.
     */
    orderBy?: ppt_decksOrderByWithRelationInput | ppt_decksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ppt_decksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ppt_decks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ppt_decks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ppt_decks
    **/
    _count?: true | Ppt_decksCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Ppt_decksMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Ppt_decksMaxAggregateInputType
  }

  export type GetPpt_decksAggregateType<T extends Ppt_decksAggregateArgs> = {
        [P in keyof T & keyof AggregatePpt_decks]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePpt_decks[P]>
      : GetScalarType<T[P], AggregatePpt_decks[P]>
  }




  export type ppt_decksGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ppt_decksWhereInput
    orderBy?: ppt_decksOrderByWithAggregationInput | ppt_decksOrderByWithAggregationInput[]
    by: Ppt_decksScalarFieldEnum[] | Ppt_decksScalarFieldEnum
    having?: ppt_decksScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Ppt_decksCountAggregateInputType | true
    _min?: Ppt_decksMinAggregateInputType
    _max?: Ppt_decksMaxAggregateInputType
  }

  export type Ppt_decksGroupByOutputType = {
    id: string
    title: string | null
    subtopic_id: string | null
    status: string | null
    slides: JsonValue | null
    created_by: string | null
    created_at: Date | null
    updated_at: Date | null
    _count: Ppt_decksCountAggregateOutputType | null
    _min: Ppt_decksMinAggregateOutputType | null
    _max: Ppt_decksMaxAggregateOutputType | null
  }

  type GetPpt_decksGroupByPayload<T extends ppt_decksGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Ppt_decksGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Ppt_decksGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Ppt_decksGroupByOutputType[P]>
            : GetScalarType<T[P], Ppt_decksGroupByOutputType[P]>
        }
      >
    >


  export type ppt_decksSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    subtopic_id?: boolean
    status?: boolean
    slides?: boolean
    created_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["ppt_decks"]>

  export type ppt_decksSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    subtopic_id?: boolean
    status?: boolean
    slides?: boolean
    created_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["ppt_decks"]>

  export type ppt_decksSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    subtopic_id?: boolean
    status?: boolean
    slides?: boolean
    created_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["ppt_decks"]>

  export type ppt_decksSelectScalar = {
    id?: boolean
    title?: boolean
    subtopic_id?: boolean
    status?: boolean
    slides?: boolean
    created_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ppt_decksOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "subtopic_id" | "status" | "slides" | "created_by" | "created_at" | "updated_at", ExtArgs["result"]["ppt_decks"]>

  export type $ppt_decksPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ppt_decks"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string | null
      subtopic_id: string | null
      status: string | null
      slides: Prisma.JsonValue | null
      created_by: string | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["ppt_decks"]>
    composites: {}
  }

  type ppt_decksGetPayload<S extends boolean | null | undefined | ppt_decksDefaultArgs> = $Result.GetResult<Prisma.$ppt_decksPayload, S>

  type ppt_decksCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ppt_decksFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Ppt_decksCountAggregateInputType | true
    }

  export interface ppt_decksDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ppt_decks'], meta: { name: 'ppt_decks' } }
    /**
     * Find zero or one Ppt_decks that matches the filter.
     * @param {ppt_decksFindUniqueArgs} args - Arguments to find a Ppt_decks
     * @example
     * // Get one Ppt_decks
     * const ppt_decks = await prisma.ppt_decks.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ppt_decksFindUniqueArgs>(args: SelectSubset<T, ppt_decksFindUniqueArgs<ExtArgs>>): Prisma__ppt_decksClient<$Result.GetResult<Prisma.$ppt_decksPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Ppt_decks that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ppt_decksFindUniqueOrThrowArgs} args - Arguments to find a Ppt_decks
     * @example
     * // Get one Ppt_decks
     * const ppt_decks = await prisma.ppt_decks.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ppt_decksFindUniqueOrThrowArgs>(args: SelectSubset<T, ppt_decksFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ppt_decksClient<$Result.GetResult<Prisma.$ppt_decksPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ppt_decks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ppt_decksFindFirstArgs} args - Arguments to find a Ppt_decks
     * @example
     * // Get one Ppt_decks
     * const ppt_decks = await prisma.ppt_decks.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ppt_decksFindFirstArgs>(args?: SelectSubset<T, ppt_decksFindFirstArgs<ExtArgs>>): Prisma__ppt_decksClient<$Result.GetResult<Prisma.$ppt_decksPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ppt_decks that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ppt_decksFindFirstOrThrowArgs} args - Arguments to find a Ppt_decks
     * @example
     * // Get one Ppt_decks
     * const ppt_decks = await prisma.ppt_decks.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ppt_decksFindFirstOrThrowArgs>(args?: SelectSubset<T, ppt_decksFindFirstOrThrowArgs<ExtArgs>>): Prisma__ppt_decksClient<$Result.GetResult<Prisma.$ppt_decksPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Ppt_decks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ppt_decksFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ppt_decks
     * const ppt_decks = await prisma.ppt_decks.findMany()
     * 
     * // Get first 10 Ppt_decks
     * const ppt_decks = await prisma.ppt_decks.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ppt_decksWithIdOnly = await prisma.ppt_decks.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ppt_decksFindManyArgs>(args?: SelectSubset<T, ppt_decksFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ppt_decksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Ppt_decks.
     * @param {ppt_decksCreateArgs} args - Arguments to create a Ppt_decks.
     * @example
     * // Create one Ppt_decks
     * const Ppt_decks = await prisma.ppt_decks.create({
     *   data: {
     *     // ... data to create a Ppt_decks
     *   }
     * })
     * 
     */
    create<T extends ppt_decksCreateArgs>(args: SelectSubset<T, ppt_decksCreateArgs<ExtArgs>>): Prisma__ppt_decksClient<$Result.GetResult<Prisma.$ppt_decksPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Ppt_decks.
     * @param {ppt_decksCreateManyArgs} args - Arguments to create many Ppt_decks.
     * @example
     * // Create many Ppt_decks
     * const ppt_decks = await prisma.ppt_decks.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ppt_decksCreateManyArgs>(args?: SelectSubset<T, ppt_decksCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Ppt_decks and returns the data saved in the database.
     * @param {ppt_decksCreateManyAndReturnArgs} args - Arguments to create many Ppt_decks.
     * @example
     * // Create many Ppt_decks
     * const ppt_decks = await prisma.ppt_decks.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Ppt_decks and only return the `id`
     * const ppt_decksWithIdOnly = await prisma.ppt_decks.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ppt_decksCreateManyAndReturnArgs>(args?: SelectSubset<T, ppt_decksCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ppt_decksPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Ppt_decks.
     * @param {ppt_decksDeleteArgs} args - Arguments to delete one Ppt_decks.
     * @example
     * // Delete one Ppt_decks
     * const Ppt_decks = await prisma.ppt_decks.delete({
     *   where: {
     *     // ... filter to delete one Ppt_decks
     *   }
     * })
     * 
     */
    delete<T extends ppt_decksDeleteArgs>(args: SelectSubset<T, ppt_decksDeleteArgs<ExtArgs>>): Prisma__ppt_decksClient<$Result.GetResult<Prisma.$ppt_decksPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Ppt_decks.
     * @param {ppt_decksUpdateArgs} args - Arguments to update one Ppt_decks.
     * @example
     * // Update one Ppt_decks
     * const ppt_decks = await prisma.ppt_decks.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ppt_decksUpdateArgs>(args: SelectSubset<T, ppt_decksUpdateArgs<ExtArgs>>): Prisma__ppt_decksClient<$Result.GetResult<Prisma.$ppt_decksPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Ppt_decks.
     * @param {ppt_decksDeleteManyArgs} args - Arguments to filter Ppt_decks to delete.
     * @example
     * // Delete a few Ppt_decks
     * const { count } = await prisma.ppt_decks.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ppt_decksDeleteManyArgs>(args?: SelectSubset<T, ppt_decksDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ppt_decks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ppt_decksUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ppt_decks
     * const ppt_decks = await prisma.ppt_decks.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ppt_decksUpdateManyArgs>(args: SelectSubset<T, ppt_decksUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ppt_decks and returns the data updated in the database.
     * @param {ppt_decksUpdateManyAndReturnArgs} args - Arguments to update many Ppt_decks.
     * @example
     * // Update many Ppt_decks
     * const ppt_decks = await prisma.ppt_decks.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Ppt_decks and only return the `id`
     * const ppt_decksWithIdOnly = await prisma.ppt_decks.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ppt_decksUpdateManyAndReturnArgs>(args: SelectSubset<T, ppt_decksUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ppt_decksPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Ppt_decks.
     * @param {ppt_decksUpsertArgs} args - Arguments to update or create a Ppt_decks.
     * @example
     * // Update or create a Ppt_decks
     * const ppt_decks = await prisma.ppt_decks.upsert({
     *   create: {
     *     // ... data to create a Ppt_decks
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ppt_decks we want to update
     *   }
     * })
     */
    upsert<T extends ppt_decksUpsertArgs>(args: SelectSubset<T, ppt_decksUpsertArgs<ExtArgs>>): Prisma__ppt_decksClient<$Result.GetResult<Prisma.$ppt_decksPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Ppt_decks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ppt_decksCountArgs} args - Arguments to filter Ppt_decks to count.
     * @example
     * // Count the number of Ppt_decks
     * const count = await prisma.ppt_decks.count({
     *   where: {
     *     // ... the filter for the Ppt_decks we want to count
     *   }
     * })
    **/
    count<T extends ppt_decksCountArgs>(
      args?: Subset<T, ppt_decksCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Ppt_decksCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ppt_decks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Ppt_decksAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Ppt_decksAggregateArgs>(args: Subset<T, Ppt_decksAggregateArgs>): Prisma.PrismaPromise<GetPpt_decksAggregateType<T>>

    /**
     * Group by Ppt_decks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ppt_decksGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ppt_decksGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ppt_decksGroupByArgs['orderBy'] }
        : { orderBy?: ppt_decksGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ppt_decksGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPpt_decksGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ppt_decks model
   */
  readonly fields: ppt_decksFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ppt_decks.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ppt_decksClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ppt_decks model
   */
  interface ppt_decksFieldRefs {
    readonly id: FieldRef<"ppt_decks", 'String'>
    readonly title: FieldRef<"ppt_decks", 'String'>
    readonly subtopic_id: FieldRef<"ppt_decks", 'String'>
    readonly status: FieldRef<"ppt_decks", 'String'>
    readonly slides: FieldRef<"ppt_decks", 'Json'>
    readonly created_by: FieldRef<"ppt_decks", 'String'>
    readonly created_at: FieldRef<"ppt_decks", 'DateTime'>
    readonly updated_at: FieldRef<"ppt_decks", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ppt_decks findUnique
   */
  export type ppt_decksFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ppt_decks
     */
    select?: ppt_decksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ppt_decks
     */
    omit?: ppt_decksOmit<ExtArgs> | null
    /**
     * Filter, which ppt_decks to fetch.
     */
    where: ppt_decksWhereUniqueInput
  }

  /**
   * ppt_decks findUniqueOrThrow
   */
  export type ppt_decksFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ppt_decks
     */
    select?: ppt_decksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ppt_decks
     */
    omit?: ppt_decksOmit<ExtArgs> | null
    /**
     * Filter, which ppt_decks to fetch.
     */
    where: ppt_decksWhereUniqueInput
  }

  /**
   * ppt_decks findFirst
   */
  export type ppt_decksFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ppt_decks
     */
    select?: ppt_decksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ppt_decks
     */
    omit?: ppt_decksOmit<ExtArgs> | null
    /**
     * Filter, which ppt_decks to fetch.
     */
    where?: ppt_decksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ppt_decks to fetch.
     */
    orderBy?: ppt_decksOrderByWithRelationInput | ppt_decksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ppt_decks.
     */
    cursor?: ppt_decksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ppt_decks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ppt_decks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ppt_decks.
     */
    distinct?: Ppt_decksScalarFieldEnum | Ppt_decksScalarFieldEnum[]
  }

  /**
   * ppt_decks findFirstOrThrow
   */
  export type ppt_decksFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ppt_decks
     */
    select?: ppt_decksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ppt_decks
     */
    omit?: ppt_decksOmit<ExtArgs> | null
    /**
     * Filter, which ppt_decks to fetch.
     */
    where?: ppt_decksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ppt_decks to fetch.
     */
    orderBy?: ppt_decksOrderByWithRelationInput | ppt_decksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ppt_decks.
     */
    cursor?: ppt_decksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ppt_decks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ppt_decks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ppt_decks.
     */
    distinct?: Ppt_decksScalarFieldEnum | Ppt_decksScalarFieldEnum[]
  }

  /**
   * ppt_decks findMany
   */
  export type ppt_decksFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ppt_decks
     */
    select?: ppt_decksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ppt_decks
     */
    omit?: ppt_decksOmit<ExtArgs> | null
    /**
     * Filter, which ppt_decks to fetch.
     */
    where?: ppt_decksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ppt_decks to fetch.
     */
    orderBy?: ppt_decksOrderByWithRelationInput | ppt_decksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ppt_decks.
     */
    cursor?: ppt_decksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ppt_decks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ppt_decks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ppt_decks.
     */
    distinct?: Ppt_decksScalarFieldEnum | Ppt_decksScalarFieldEnum[]
  }

  /**
   * ppt_decks create
   */
  export type ppt_decksCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ppt_decks
     */
    select?: ppt_decksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ppt_decks
     */
    omit?: ppt_decksOmit<ExtArgs> | null
    /**
     * The data needed to create a ppt_decks.
     */
    data?: XOR<ppt_decksCreateInput, ppt_decksUncheckedCreateInput>
  }

  /**
   * ppt_decks createMany
   */
  export type ppt_decksCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ppt_decks.
     */
    data: ppt_decksCreateManyInput | ppt_decksCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ppt_decks createManyAndReturn
   */
  export type ppt_decksCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ppt_decks
     */
    select?: ppt_decksSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ppt_decks
     */
    omit?: ppt_decksOmit<ExtArgs> | null
    /**
     * The data used to create many ppt_decks.
     */
    data: ppt_decksCreateManyInput | ppt_decksCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ppt_decks update
   */
  export type ppt_decksUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ppt_decks
     */
    select?: ppt_decksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ppt_decks
     */
    omit?: ppt_decksOmit<ExtArgs> | null
    /**
     * The data needed to update a ppt_decks.
     */
    data: XOR<ppt_decksUpdateInput, ppt_decksUncheckedUpdateInput>
    /**
     * Choose, which ppt_decks to update.
     */
    where: ppt_decksWhereUniqueInput
  }

  /**
   * ppt_decks updateMany
   */
  export type ppt_decksUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ppt_decks.
     */
    data: XOR<ppt_decksUpdateManyMutationInput, ppt_decksUncheckedUpdateManyInput>
    /**
     * Filter which ppt_decks to update
     */
    where?: ppt_decksWhereInput
    /**
     * Limit how many ppt_decks to update.
     */
    limit?: number
  }

  /**
   * ppt_decks updateManyAndReturn
   */
  export type ppt_decksUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ppt_decks
     */
    select?: ppt_decksSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ppt_decks
     */
    omit?: ppt_decksOmit<ExtArgs> | null
    /**
     * The data used to update ppt_decks.
     */
    data: XOR<ppt_decksUpdateManyMutationInput, ppt_decksUncheckedUpdateManyInput>
    /**
     * Filter which ppt_decks to update
     */
    where?: ppt_decksWhereInput
    /**
     * Limit how many ppt_decks to update.
     */
    limit?: number
  }

  /**
   * ppt_decks upsert
   */
  export type ppt_decksUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ppt_decks
     */
    select?: ppt_decksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ppt_decks
     */
    omit?: ppt_decksOmit<ExtArgs> | null
    /**
     * The filter to search for the ppt_decks to update in case it exists.
     */
    where: ppt_decksWhereUniqueInput
    /**
     * In case the ppt_decks found by the `where` argument doesn't exist, create a new ppt_decks with this data.
     */
    create: XOR<ppt_decksCreateInput, ppt_decksUncheckedCreateInput>
    /**
     * In case the ppt_decks was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ppt_decksUpdateInput, ppt_decksUncheckedUpdateInput>
  }

  /**
   * ppt_decks delete
   */
  export type ppt_decksDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ppt_decks
     */
    select?: ppt_decksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ppt_decks
     */
    omit?: ppt_decksOmit<ExtArgs> | null
    /**
     * Filter which ppt_decks to delete.
     */
    where: ppt_decksWhereUniqueInput
  }

  /**
   * ppt_decks deleteMany
   */
  export type ppt_decksDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ppt_decks to delete
     */
    where?: ppt_decksWhereInput
    /**
     * Limit how many ppt_decks to delete.
     */
    limit?: number
  }

  /**
   * ppt_decks without action
   */
  export type ppt_decksDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ppt_decks
     */
    select?: ppt_decksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ppt_decks
     */
    omit?: ppt_decksOmit<ExtArgs> | null
  }


  /**
   * Model production_targets
   */

  export type AggregateProduction_targets = {
    _count: Production_targetsCountAggregateOutputType | null
    _avg: Production_targetsAvgAggregateOutputType | null
    _sum: Production_targetsSumAggregateOutputType | null
    _min: Production_targetsMinAggregateOutputType | null
    _max: Production_targetsMaxAggregateOutputType | null
  }

  export type Production_targetsAvgAggregateOutputType = {
    total_target: number | null
  }

  export type Production_targetsSumAggregateOutputType = {
    total_target: number | null
  }

  export type Production_targetsMinAggregateOutputType = {
    id: string | null
    total_target: number | null
    start_date: Date | null
    end_date: Date | null
    created_at: Date | null
    updated_at: Date | null
    subject_id: string | null
  }

  export type Production_targetsMaxAggregateOutputType = {
    id: string | null
    total_target: number | null
    start_date: Date | null
    end_date: Date | null
    created_at: Date | null
    updated_at: Date | null
    subject_id: string | null
  }

  export type Production_targetsCountAggregateOutputType = {
    id: number
    total_target: number
    start_date: number
    end_date: number
    created_at: number
    updated_at: number
    subject_id: number
    _all: number
  }


  export type Production_targetsAvgAggregateInputType = {
    total_target?: true
  }

  export type Production_targetsSumAggregateInputType = {
    total_target?: true
  }

  export type Production_targetsMinAggregateInputType = {
    id?: true
    total_target?: true
    start_date?: true
    end_date?: true
    created_at?: true
    updated_at?: true
    subject_id?: true
  }

  export type Production_targetsMaxAggregateInputType = {
    id?: true
    total_target?: true
    start_date?: true
    end_date?: true
    created_at?: true
    updated_at?: true
    subject_id?: true
  }

  export type Production_targetsCountAggregateInputType = {
    id?: true
    total_target?: true
    start_date?: true
    end_date?: true
    created_at?: true
    updated_at?: true
    subject_id?: true
    _all?: true
  }

  export type Production_targetsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which production_targets to aggregate.
     */
    where?: production_targetsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of production_targets to fetch.
     */
    orderBy?: production_targetsOrderByWithRelationInput | production_targetsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: production_targetsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` production_targets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` production_targets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned production_targets
    **/
    _count?: true | Production_targetsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Production_targetsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Production_targetsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Production_targetsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Production_targetsMaxAggregateInputType
  }

  export type GetProduction_targetsAggregateType<T extends Production_targetsAggregateArgs> = {
        [P in keyof T & keyof AggregateProduction_targets]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduction_targets[P]>
      : GetScalarType<T[P], AggregateProduction_targets[P]>
  }




  export type production_targetsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: production_targetsWhereInput
    orderBy?: production_targetsOrderByWithAggregationInput | production_targetsOrderByWithAggregationInput[]
    by: Production_targetsScalarFieldEnum[] | Production_targetsScalarFieldEnum
    having?: production_targetsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Production_targetsCountAggregateInputType | true
    _avg?: Production_targetsAvgAggregateInputType
    _sum?: Production_targetsSumAggregateInputType
    _min?: Production_targetsMinAggregateInputType
    _max?: Production_targetsMaxAggregateInputType
  }

  export type Production_targetsGroupByOutputType = {
    id: string
    total_target: number
    start_date: Date
    end_date: Date
    created_at: Date | null
    updated_at: Date | null
    subject_id: string | null
    _count: Production_targetsCountAggregateOutputType | null
    _avg: Production_targetsAvgAggregateOutputType | null
    _sum: Production_targetsSumAggregateOutputType | null
    _min: Production_targetsMinAggregateOutputType | null
    _max: Production_targetsMaxAggregateOutputType | null
  }

  type GetProduction_targetsGroupByPayload<T extends production_targetsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Production_targetsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Production_targetsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Production_targetsGroupByOutputType[P]>
            : GetScalarType<T[P], Production_targetsGroupByOutputType[P]>
        }
      >
    >


  export type production_targetsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    total_target?: boolean
    start_date?: boolean
    end_date?: boolean
    created_at?: boolean
    updated_at?: boolean
    subject_id?: boolean
  }, ExtArgs["result"]["production_targets"]>

  export type production_targetsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    total_target?: boolean
    start_date?: boolean
    end_date?: boolean
    created_at?: boolean
    updated_at?: boolean
    subject_id?: boolean
  }, ExtArgs["result"]["production_targets"]>

  export type production_targetsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    total_target?: boolean
    start_date?: boolean
    end_date?: boolean
    created_at?: boolean
    updated_at?: boolean
    subject_id?: boolean
  }, ExtArgs["result"]["production_targets"]>

  export type production_targetsSelectScalar = {
    id?: boolean
    total_target?: boolean
    start_date?: boolean
    end_date?: boolean
    created_at?: boolean
    updated_at?: boolean
    subject_id?: boolean
  }

  export type production_targetsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "total_target" | "start_date" | "end_date" | "created_at" | "updated_at" | "subject_id", ExtArgs["result"]["production_targets"]>

  export type $production_targetsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "production_targets"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      total_target: number
      start_date: Date
      end_date: Date
      created_at: Date | null
      updated_at: Date | null
      subject_id: string | null
    }, ExtArgs["result"]["production_targets"]>
    composites: {}
  }

  type production_targetsGetPayload<S extends boolean | null | undefined | production_targetsDefaultArgs> = $Result.GetResult<Prisma.$production_targetsPayload, S>

  type production_targetsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<production_targetsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Production_targetsCountAggregateInputType | true
    }

  export interface production_targetsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['production_targets'], meta: { name: 'production_targets' } }
    /**
     * Find zero or one Production_targets that matches the filter.
     * @param {production_targetsFindUniqueArgs} args - Arguments to find a Production_targets
     * @example
     * // Get one Production_targets
     * const production_targets = await prisma.production_targets.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends production_targetsFindUniqueArgs>(args: SelectSubset<T, production_targetsFindUniqueArgs<ExtArgs>>): Prisma__production_targetsClient<$Result.GetResult<Prisma.$production_targetsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Production_targets that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {production_targetsFindUniqueOrThrowArgs} args - Arguments to find a Production_targets
     * @example
     * // Get one Production_targets
     * const production_targets = await prisma.production_targets.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends production_targetsFindUniqueOrThrowArgs>(args: SelectSubset<T, production_targetsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__production_targetsClient<$Result.GetResult<Prisma.$production_targetsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Production_targets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {production_targetsFindFirstArgs} args - Arguments to find a Production_targets
     * @example
     * // Get one Production_targets
     * const production_targets = await prisma.production_targets.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends production_targetsFindFirstArgs>(args?: SelectSubset<T, production_targetsFindFirstArgs<ExtArgs>>): Prisma__production_targetsClient<$Result.GetResult<Prisma.$production_targetsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Production_targets that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {production_targetsFindFirstOrThrowArgs} args - Arguments to find a Production_targets
     * @example
     * // Get one Production_targets
     * const production_targets = await prisma.production_targets.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends production_targetsFindFirstOrThrowArgs>(args?: SelectSubset<T, production_targetsFindFirstOrThrowArgs<ExtArgs>>): Prisma__production_targetsClient<$Result.GetResult<Prisma.$production_targetsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Production_targets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {production_targetsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Production_targets
     * const production_targets = await prisma.production_targets.findMany()
     * 
     * // Get first 10 Production_targets
     * const production_targets = await prisma.production_targets.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const production_targetsWithIdOnly = await prisma.production_targets.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends production_targetsFindManyArgs>(args?: SelectSubset<T, production_targetsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$production_targetsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Production_targets.
     * @param {production_targetsCreateArgs} args - Arguments to create a Production_targets.
     * @example
     * // Create one Production_targets
     * const Production_targets = await prisma.production_targets.create({
     *   data: {
     *     // ... data to create a Production_targets
     *   }
     * })
     * 
     */
    create<T extends production_targetsCreateArgs>(args: SelectSubset<T, production_targetsCreateArgs<ExtArgs>>): Prisma__production_targetsClient<$Result.GetResult<Prisma.$production_targetsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Production_targets.
     * @param {production_targetsCreateManyArgs} args - Arguments to create many Production_targets.
     * @example
     * // Create many Production_targets
     * const production_targets = await prisma.production_targets.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends production_targetsCreateManyArgs>(args?: SelectSubset<T, production_targetsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Production_targets and returns the data saved in the database.
     * @param {production_targetsCreateManyAndReturnArgs} args - Arguments to create many Production_targets.
     * @example
     * // Create many Production_targets
     * const production_targets = await prisma.production_targets.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Production_targets and only return the `id`
     * const production_targetsWithIdOnly = await prisma.production_targets.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends production_targetsCreateManyAndReturnArgs>(args?: SelectSubset<T, production_targetsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$production_targetsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Production_targets.
     * @param {production_targetsDeleteArgs} args - Arguments to delete one Production_targets.
     * @example
     * // Delete one Production_targets
     * const Production_targets = await prisma.production_targets.delete({
     *   where: {
     *     // ... filter to delete one Production_targets
     *   }
     * })
     * 
     */
    delete<T extends production_targetsDeleteArgs>(args: SelectSubset<T, production_targetsDeleteArgs<ExtArgs>>): Prisma__production_targetsClient<$Result.GetResult<Prisma.$production_targetsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Production_targets.
     * @param {production_targetsUpdateArgs} args - Arguments to update one Production_targets.
     * @example
     * // Update one Production_targets
     * const production_targets = await prisma.production_targets.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends production_targetsUpdateArgs>(args: SelectSubset<T, production_targetsUpdateArgs<ExtArgs>>): Prisma__production_targetsClient<$Result.GetResult<Prisma.$production_targetsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Production_targets.
     * @param {production_targetsDeleteManyArgs} args - Arguments to filter Production_targets to delete.
     * @example
     * // Delete a few Production_targets
     * const { count } = await prisma.production_targets.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends production_targetsDeleteManyArgs>(args?: SelectSubset<T, production_targetsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Production_targets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {production_targetsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Production_targets
     * const production_targets = await prisma.production_targets.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends production_targetsUpdateManyArgs>(args: SelectSubset<T, production_targetsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Production_targets and returns the data updated in the database.
     * @param {production_targetsUpdateManyAndReturnArgs} args - Arguments to update many Production_targets.
     * @example
     * // Update many Production_targets
     * const production_targets = await prisma.production_targets.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Production_targets and only return the `id`
     * const production_targetsWithIdOnly = await prisma.production_targets.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends production_targetsUpdateManyAndReturnArgs>(args: SelectSubset<T, production_targetsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$production_targetsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Production_targets.
     * @param {production_targetsUpsertArgs} args - Arguments to update or create a Production_targets.
     * @example
     * // Update or create a Production_targets
     * const production_targets = await prisma.production_targets.upsert({
     *   create: {
     *     // ... data to create a Production_targets
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Production_targets we want to update
     *   }
     * })
     */
    upsert<T extends production_targetsUpsertArgs>(args: SelectSubset<T, production_targetsUpsertArgs<ExtArgs>>): Prisma__production_targetsClient<$Result.GetResult<Prisma.$production_targetsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Production_targets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {production_targetsCountArgs} args - Arguments to filter Production_targets to count.
     * @example
     * // Count the number of Production_targets
     * const count = await prisma.production_targets.count({
     *   where: {
     *     // ... the filter for the Production_targets we want to count
     *   }
     * })
    **/
    count<T extends production_targetsCountArgs>(
      args?: Subset<T, production_targetsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Production_targetsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Production_targets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Production_targetsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Production_targetsAggregateArgs>(args: Subset<T, Production_targetsAggregateArgs>): Prisma.PrismaPromise<GetProduction_targetsAggregateType<T>>

    /**
     * Group by Production_targets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {production_targetsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends production_targetsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: production_targetsGroupByArgs['orderBy'] }
        : { orderBy?: production_targetsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, production_targetsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProduction_targetsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the production_targets model
   */
  readonly fields: production_targetsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for production_targets.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__production_targetsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the production_targets model
   */
  interface production_targetsFieldRefs {
    readonly id: FieldRef<"production_targets", 'String'>
    readonly total_target: FieldRef<"production_targets", 'Int'>
    readonly start_date: FieldRef<"production_targets", 'DateTime'>
    readonly end_date: FieldRef<"production_targets", 'DateTime'>
    readonly created_at: FieldRef<"production_targets", 'DateTime'>
    readonly updated_at: FieldRef<"production_targets", 'DateTime'>
    readonly subject_id: FieldRef<"production_targets", 'String'>
  }
    

  // Custom InputTypes
  /**
   * production_targets findUnique
   */
  export type production_targetsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the production_targets
     */
    select?: production_targetsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the production_targets
     */
    omit?: production_targetsOmit<ExtArgs> | null
    /**
     * Filter, which production_targets to fetch.
     */
    where: production_targetsWhereUniqueInput
  }

  /**
   * production_targets findUniqueOrThrow
   */
  export type production_targetsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the production_targets
     */
    select?: production_targetsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the production_targets
     */
    omit?: production_targetsOmit<ExtArgs> | null
    /**
     * Filter, which production_targets to fetch.
     */
    where: production_targetsWhereUniqueInput
  }

  /**
   * production_targets findFirst
   */
  export type production_targetsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the production_targets
     */
    select?: production_targetsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the production_targets
     */
    omit?: production_targetsOmit<ExtArgs> | null
    /**
     * Filter, which production_targets to fetch.
     */
    where?: production_targetsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of production_targets to fetch.
     */
    orderBy?: production_targetsOrderByWithRelationInput | production_targetsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for production_targets.
     */
    cursor?: production_targetsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` production_targets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` production_targets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of production_targets.
     */
    distinct?: Production_targetsScalarFieldEnum | Production_targetsScalarFieldEnum[]
  }

  /**
   * production_targets findFirstOrThrow
   */
  export type production_targetsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the production_targets
     */
    select?: production_targetsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the production_targets
     */
    omit?: production_targetsOmit<ExtArgs> | null
    /**
     * Filter, which production_targets to fetch.
     */
    where?: production_targetsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of production_targets to fetch.
     */
    orderBy?: production_targetsOrderByWithRelationInput | production_targetsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for production_targets.
     */
    cursor?: production_targetsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` production_targets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` production_targets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of production_targets.
     */
    distinct?: Production_targetsScalarFieldEnum | Production_targetsScalarFieldEnum[]
  }

  /**
   * production_targets findMany
   */
  export type production_targetsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the production_targets
     */
    select?: production_targetsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the production_targets
     */
    omit?: production_targetsOmit<ExtArgs> | null
    /**
     * Filter, which production_targets to fetch.
     */
    where?: production_targetsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of production_targets to fetch.
     */
    orderBy?: production_targetsOrderByWithRelationInput | production_targetsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing production_targets.
     */
    cursor?: production_targetsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` production_targets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` production_targets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of production_targets.
     */
    distinct?: Production_targetsScalarFieldEnum | Production_targetsScalarFieldEnum[]
  }

  /**
   * production_targets create
   */
  export type production_targetsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the production_targets
     */
    select?: production_targetsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the production_targets
     */
    omit?: production_targetsOmit<ExtArgs> | null
    /**
     * The data needed to create a production_targets.
     */
    data: XOR<production_targetsCreateInput, production_targetsUncheckedCreateInput>
  }

  /**
   * production_targets createMany
   */
  export type production_targetsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many production_targets.
     */
    data: production_targetsCreateManyInput | production_targetsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * production_targets createManyAndReturn
   */
  export type production_targetsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the production_targets
     */
    select?: production_targetsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the production_targets
     */
    omit?: production_targetsOmit<ExtArgs> | null
    /**
     * The data used to create many production_targets.
     */
    data: production_targetsCreateManyInput | production_targetsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * production_targets update
   */
  export type production_targetsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the production_targets
     */
    select?: production_targetsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the production_targets
     */
    omit?: production_targetsOmit<ExtArgs> | null
    /**
     * The data needed to update a production_targets.
     */
    data: XOR<production_targetsUpdateInput, production_targetsUncheckedUpdateInput>
    /**
     * Choose, which production_targets to update.
     */
    where: production_targetsWhereUniqueInput
  }

  /**
   * production_targets updateMany
   */
  export type production_targetsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update production_targets.
     */
    data: XOR<production_targetsUpdateManyMutationInput, production_targetsUncheckedUpdateManyInput>
    /**
     * Filter which production_targets to update
     */
    where?: production_targetsWhereInput
    /**
     * Limit how many production_targets to update.
     */
    limit?: number
  }

  /**
   * production_targets updateManyAndReturn
   */
  export type production_targetsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the production_targets
     */
    select?: production_targetsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the production_targets
     */
    omit?: production_targetsOmit<ExtArgs> | null
    /**
     * The data used to update production_targets.
     */
    data: XOR<production_targetsUpdateManyMutationInput, production_targetsUncheckedUpdateManyInput>
    /**
     * Filter which production_targets to update
     */
    where?: production_targetsWhereInput
    /**
     * Limit how many production_targets to update.
     */
    limit?: number
  }

  /**
   * production_targets upsert
   */
  export type production_targetsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the production_targets
     */
    select?: production_targetsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the production_targets
     */
    omit?: production_targetsOmit<ExtArgs> | null
    /**
     * The filter to search for the production_targets to update in case it exists.
     */
    where: production_targetsWhereUniqueInput
    /**
     * In case the production_targets found by the `where` argument doesn't exist, create a new production_targets with this data.
     */
    create: XOR<production_targetsCreateInput, production_targetsUncheckedCreateInput>
    /**
     * In case the production_targets was found with the provided `where` argument, update it with this data.
     */
    update: XOR<production_targetsUpdateInput, production_targetsUncheckedUpdateInput>
  }

  /**
   * production_targets delete
   */
  export type production_targetsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the production_targets
     */
    select?: production_targetsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the production_targets
     */
    omit?: production_targetsOmit<ExtArgs> | null
    /**
     * Filter which production_targets to delete.
     */
    where: production_targetsWhereUniqueInput
  }

  /**
   * production_targets deleteMany
   */
  export type production_targetsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which production_targets to delete
     */
    where?: production_targetsWhereInput
    /**
     * Limit how many production_targets to delete.
     */
    limit?: number
  }

  /**
   * production_targets without action
   */
  export type production_targetsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the production_targets
     */
    select?: production_targetsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the production_targets
     */
    omit?: production_targetsOmit<ExtArgs> | null
  }


  /**
   * Model profiles
   */

  export type AggregateProfiles = {
    _count: ProfilesCountAggregateOutputType | null
    _min: ProfilesMinAggregateOutputType | null
    _max: ProfilesMaxAggregateOutputType | null
  }

  export type ProfilesMinAggregateOutputType = {
    id: string | null
    email: string | null
    role: string | null
    full_name: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ProfilesMaxAggregateOutputType = {
    id: string | null
    email: string | null
    role: string | null
    full_name: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ProfilesCountAggregateOutputType = {
    id: number
    email: number
    role: number
    full_name: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ProfilesMinAggregateInputType = {
    id?: true
    email?: true
    role?: true
    full_name?: true
    created_at?: true
    updated_at?: true
  }

  export type ProfilesMaxAggregateInputType = {
    id?: true
    email?: true
    role?: true
    full_name?: true
    created_at?: true
    updated_at?: true
  }

  export type ProfilesCountAggregateInputType = {
    id?: true
    email?: true
    role?: true
    full_name?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ProfilesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which profiles to aggregate.
     */
    where?: profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of profiles to fetch.
     */
    orderBy?: profilesOrderByWithRelationInput | profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned profiles
    **/
    _count?: true | ProfilesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfilesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfilesMaxAggregateInputType
  }

  export type GetProfilesAggregateType<T extends ProfilesAggregateArgs> = {
        [P in keyof T & keyof AggregateProfiles]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfiles[P]>
      : GetScalarType<T[P], AggregateProfiles[P]>
  }




  export type profilesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: profilesWhereInput
    orderBy?: profilesOrderByWithAggregationInput | profilesOrderByWithAggregationInput[]
    by: ProfilesScalarFieldEnum[] | ProfilesScalarFieldEnum
    having?: profilesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfilesCountAggregateInputType | true
    _min?: ProfilesMinAggregateInputType
    _max?: ProfilesMaxAggregateInputType
  }

  export type ProfilesGroupByOutputType = {
    id: string
    email: string | null
    role: string | null
    full_name: string | null
    created_at: Date | null
    updated_at: Date | null
    _count: ProfilesCountAggregateOutputType | null
    _min: ProfilesMinAggregateOutputType | null
    _max: ProfilesMaxAggregateOutputType | null
  }

  type GetProfilesGroupByPayload<T extends profilesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfilesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfilesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfilesGroupByOutputType[P]>
            : GetScalarType<T[P], ProfilesGroupByOutputType[P]>
        }
      >
    >


  export type profilesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    role?: boolean
    full_name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["profiles"]>

  export type profilesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    role?: boolean
    full_name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["profiles"]>

  export type profilesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    role?: boolean
    full_name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["profiles"]>

  export type profilesSelectScalar = {
    id?: boolean
    email?: boolean
    role?: boolean
    full_name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type profilesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "role" | "full_name" | "created_at" | "updated_at", ExtArgs["result"]["profiles"]>

  export type $profilesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "profiles"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string | null
      role: string | null
      full_name: string | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["profiles"]>
    composites: {}
  }

  type profilesGetPayload<S extends boolean | null | undefined | profilesDefaultArgs> = $Result.GetResult<Prisma.$profilesPayload, S>

  type profilesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<profilesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfilesCountAggregateInputType | true
    }

  export interface profilesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['profiles'], meta: { name: 'profiles' } }
    /**
     * Find zero or one Profiles that matches the filter.
     * @param {profilesFindUniqueArgs} args - Arguments to find a Profiles
     * @example
     * // Get one Profiles
     * const profiles = await prisma.profiles.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends profilesFindUniqueArgs>(args: SelectSubset<T, profilesFindUniqueArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Profiles that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {profilesFindUniqueOrThrowArgs} args - Arguments to find a Profiles
     * @example
     * // Get one Profiles
     * const profiles = await prisma.profiles.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends profilesFindUniqueOrThrowArgs>(args: SelectSubset<T, profilesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {profilesFindFirstArgs} args - Arguments to find a Profiles
     * @example
     * // Get one Profiles
     * const profiles = await prisma.profiles.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends profilesFindFirstArgs>(args?: SelectSubset<T, profilesFindFirstArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profiles that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {profilesFindFirstOrThrowArgs} args - Arguments to find a Profiles
     * @example
     * // Get one Profiles
     * const profiles = await prisma.profiles.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends profilesFindFirstOrThrowArgs>(args?: SelectSubset<T, profilesFindFirstOrThrowArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {profilesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profiles
     * const profiles = await prisma.profiles.findMany()
     * 
     * // Get first 10 Profiles
     * const profiles = await prisma.profiles.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profilesWithIdOnly = await prisma.profiles.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends profilesFindManyArgs>(args?: SelectSubset<T, profilesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Profiles.
     * @param {profilesCreateArgs} args - Arguments to create a Profiles.
     * @example
     * // Create one Profiles
     * const Profiles = await prisma.profiles.create({
     *   data: {
     *     // ... data to create a Profiles
     *   }
     * })
     * 
     */
    create<T extends profilesCreateArgs>(args: SelectSubset<T, profilesCreateArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Profiles.
     * @param {profilesCreateManyArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profiles = await prisma.profiles.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends profilesCreateManyArgs>(args?: SelectSubset<T, profilesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Profiles and returns the data saved in the database.
     * @param {profilesCreateManyAndReturnArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profiles = await prisma.profiles.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Profiles and only return the `id`
     * const profilesWithIdOnly = await prisma.profiles.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends profilesCreateManyAndReturnArgs>(args?: SelectSubset<T, profilesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Profiles.
     * @param {profilesDeleteArgs} args - Arguments to delete one Profiles.
     * @example
     * // Delete one Profiles
     * const Profiles = await prisma.profiles.delete({
     *   where: {
     *     // ... filter to delete one Profiles
     *   }
     * })
     * 
     */
    delete<T extends profilesDeleteArgs>(args: SelectSubset<T, profilesDeleteArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Profiles.
     * @param {profilesUpdateArgs} args - Arguments to update one Profiles.
     * @example
     * // Update one Profiles
     * const profiles = await prisma.profiles.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends profilesUpdateArgs>(args: SelectSubset<T, profilesUpdateArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Profiles.
     * @param {profilesDeleteManyArgs} args - Arguments to filter Profiles to delete.
     * @example
     * // Delete a few Profiles
     * const { count } = await prisma.profiles.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends profilesDeleteManyArgs>(args?: SelectSubset<T, profilesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {profilesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profiles
     * const profiles = await prisma.profiles.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends profilesUpdateManyArgs>(args: SelectSubset<T, profilesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles and returns the data updated in the database.
     * @param {profilesUpdateManyAndReturnArgs} args - Arguments to update many Profiles.
     * @example
     * // Update many Profiles
     * const profiles = await prisma.profiles.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Profiles and only return the `id`
     * const profilesWithIdOnly = await prisma.profiles.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends profilesUpdateManyAndReturnArgs>(args: SelectSubset<T, profilesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Profiles.
     * @param {profilesUpsertArgs} args - Arguments to update or create a Profiles.
     * @example
     * // Update or create a Profiles
     * const profiles = await prisma.profiles.upsert({
     *   create: {
     *     // ... data to create a Profiles
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profiles we want to update
     *   }
     * })
     */
    upsert<T extends profilesUpsertArgs>(args: SelectSubset<T, profilesUpsertArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {profilesCountArgs} args - Arguments to filter Profiles to count.
     * @example
     * // Count the number of Profiles
     * const count = await prisma.profiles.count({
     *   where: {
     *     // ... the filter for the Profiles we want to count
     *   }
     * })
    **/
    count<T extends profilesCountArgs>(
      args?: Subset<T, profilesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfilesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfilesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProfilesAggregateArgs>(args: Subset<T, ProfilesAggregateArgs>): Prisma.PrismaPromise<GetProfilesAggregateType<T>>

    /**
     * Group by Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {profilesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends profilesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: profilesGroupByArgs['orderBy'] }
        : { orderBy?: profilesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, profilesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfilesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the profiles model
   */
  readonly fields: profilesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for profiles.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__profilesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the profiles model
   */
  interface profilesFieldRefs {
    readonly id: FieldRef<"profiles", 'String'>
    readonly email: FieldRef<"profiles", 'String'>
    readonly role: FieldRef<"profiles", 'String'>
    readonly full_name: FieldRef<"profiles", 'String'>
    readonly created_at: FieldRef<"profiles", 'DateTime'>
    readonly updated_at: FieldRef<"profiles", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * profiles findUnique
   */
  export type profilesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * Filter, which profiles to fetch.
     */
    where: profilesWhereUniqueInput
  }

  /**
   * profiles findUniqueOrThrow
   */
  export type profilesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * Filter, which profiles to fetch.
     */
    where: profilesWhereUniqueInput
  }

  /**
   * profiles findFirst
   */
  export type profilesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * Filter, which profiles to fetch.
     */
    where?: profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of profiles to fetch.
     */
    orderBy?: profilesOrderByWithRelationInput | profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for profiles.
     */
    cursor?: profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of profiles.
     */
    distinct?: ProfilesScalarFieldEnum | ProfilesScalarFieldEnum[]
  }

  /**
   * profiles findFirstOrThrow
   */
  export type profilesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * Filter, which profiles to fetch.
     */
    where?: profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of profiles to fetch.
     */
    orderBy?: profilesOrderByWithRelationInput | profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for profiles.
     */
    cursor?: profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of profiles.
     */
    distinct?: ProfilesScalarFieldEnum | ProfilesScalarFieldEnum[]
  }

  /**
   * profiles findMany
   */
  export type profilesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * Filter, which profiles to fetch.
     */
    where?: profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of profiles to fetch.
     */
    orderBy?: profilesOrderByWithRelationInput | profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing profiles.
     */
    cursor?: profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of profiles.
     */
    distinct?: ProfilesScalarFieldEnum | ProfilesScalarFieldEnum[]
  }

  /**
   * profiles create
   */
  export type profilesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * The data needed to create a profiles.
     */
    data: XOR<profilesCreateInput, profilesUncheckedCreateInput>
  }

  /**
   * profiles createMany
   */
  export type profilesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many profiles.
     */
    data: profilesCreateManyInput | profilesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * profiles createManyAndReturn
   */
  export type profilesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * The data used to create many profiles.
     */
    data: profilesCreateManyInput | profilesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * profiles update
   */
  export type profilesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * The data needed to update a profiles.
     */
    data: XOR<profilesUpdateInput, profilesUncheckedUpdateInput>
    /**
     * Choose, which profiles to update.
     */
    where: profilesWhereUniqueInput
  }

  /**
   * profiles updateMany
   */
  export type profilesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update profiles.
     */
    data: XOR<profilesUpdateManyMutationInput, profilesUncheckedUpdateManyInput>
    /**
     * Filter which profiles to update
     */
    where?: profilesWhereInput
    /**
     * Limit how many profiles to update.
     */
    limit?: number
  }

  /**
   * profiles updateManyAndReturn
   */
  export type profilesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * The data used to update profiles.
     */
    data: XOR<profilesUpdateManyMutationInput, profilesUncheckedUpdateManyInput>
    /**
     * Filter which profiles to update
     */
    where?: profilesWhereInput
    /**
     * Limit how many profiles to update.
     */
    limit?: number
  }

  /**
   * profiles upsert
   */
  export type profilesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * The filter to search for the profiles to update in case it exists.
     */
    where: profilesWhereUniqueInput
    /**
     * In case the profiles found by the `where` argument doesn't exist, create a new profiles with this data.
     */
    create: XOR<profilesCreateInput, profilesUncheckedCreateInput>
    /**
     * In case the profiles was found with the provided `where` argument, update it with this data.
     */
    update: XOR<profilesUpdateInput, profilesUncheckedUpdateInput>
  }

  /**
   * profiles delete
   */
  export type profilesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * Filter which profiles to delete.
     */
    where: profilesWhereUniqueInput
  }

  /**
   * profiles deleteMany
   */
  export type profilesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which profiles to delete
     */
    where?: profilesWhereInput
    /**
     * Limit how many profiles to delete.
     */
    limit?: number
  }

  /**
   * profiles without action
   */
  export type profilesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
  }


  /**
   * Model question_images
   */

  export type AggregateQuestion_images = {
    _count: Question_imagesCountAggregateOutputType | null
    _avg: Question_imagesAvgAggregateOutputType | null
    _sum: Question_imagesSumAggregateOutputType | null
    _min: Question_imagesMinAggregateOutputType | null
    _max: Question_imagesMaxAggregateOutputType | null
  }

  export type Question_imagesAvgAggregateOutputType = {
    sort_order: number | null
  }

  export type Question_imagesSumAggregateOutputType = {
    sort_order: number | null
  }

  export type Question_imagesMinAggregateOutputType = {
    id: string | null
    question_id: string | null
    storage_path: string | null
    public_url: string | null
    image_type: string | null
    caption: string | null
    sort_order: number | null
    uploaded_by: string | null
    created_at: Date | null
    display_url: string | null
  }

  export type Question_imagesMaxAggregateOutputType = {
    id: string | null
    question_id: string | null
    storage_path: string | null
    public_url: string | null
    image_type: string | null
    caption: string | null
    sort_order: number | null
    uploaded_by: string | null
    created_at: Date | null
    display_url: string | null
  }

  export type Question_imagesCountAggregateOutputType = {
    id: number
    question_id: number
    storage_path: number
    public_url: number
    image_type: number
    caption: number
    sort_order: number
    uploaded_by: number
    created_at: number
    display_url: number
    _all: number
  }


  export type Question_imagesAvgAggregateInputType = {
    sort_order?: true
  }

  export type Question_imagesSumAggregateInputType = {
    sort_order?: true
  }

  export type Question_imagesMinAggregateInputType = {
    id?: true
    question_id?: true
    storage_path?: true
    public_url?: true
    image_type?: true
    caption?: true
    sort_order?: true
    uploaded_by?: true
    created_at?: true
    display_url?: true
  }

  export type Question_imagesMaxAggregateInputType = {
    id?: true
    question_id?: true
    storage_path?: true
    public_url?: true
    image_type?: true
    caption?: true
    sort_order?: true
    uploaded_by?: true
    created_at?: true
    display_url?: true
  }

  export type Question_imagesCountAggregateInputType = {
    id?: true
    question_id?: true
    storage_path?: true
    public_url?: true
    image_type?: true
    caption?: true
    sort_order?: true
    uploaded_by?: true
    created_at?: true
    display_url?: true
    _all?: true
  }

  export type Question_imagesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which question_images to aggregate.
     */
    where?: question_imagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of question_images to fetch.
     */
    orderBy?: question_imagesOrderByWithRelationInput | question_imagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: question_imagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` question_images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` question_images.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned question_images
    **/
    _count?: true | Question_imagesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Question_imagesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Question_imagesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Question_imagesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Question_imagesMaxAggregateInputType
  }

  export type GetQuestion_imagesAggregateType<T extends Question_imagesAggregateArgs> = {
        [P in keyof T & keyof AggregateQuestion_images]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuestion_images[P]>
      : GetScalarType<T[P], AggregateQuestion_images[P]>
  }




  export type question_imagesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: question_imagesWhereInput
    orderBy?: question_imagesOrderByWithAggregationInput | question_imagesOrderByWithAggregationInput[]
    by: Question_imagesScalarFieldEnum[] | Question_imagesScalarFieldEnum
    having?: question_imagesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Question_imagesCountAggregateInputType | true
    _avg?: Question_imagesAvgAggregateInputType
    _sum?: Question_imagesSumAggregateInputType
    _min?: Question_imagesMinAggregateInputType
    _max?: Question_imagesMaxAggregateInputType
  }

  export type Question_imagesGroupByOutputType = {
    id: string
    question_id: string
    storage_path: string
    public_url: string | null
    image_type: string
    caption: string | null
    sort_order: number
    uploaded_by: string | null
    created_at: Date | null
    display_url: string | null
    _count: Question_imagesCountAggregateOutputType | null
    _avg: Question_imagesAvgAggregateOutputType | null
    _sum: Question_imagesSumAggregateOutputType | null
    _min: Question_imagesMinAggregateOutputType | null
    _max: Question_imagesMaxAggregateOutputType | null
  }

  type GetQuestion_imagesGroupByPayload<T extends question_imagesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Question_imagesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Question_imagesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Question_imagesGroupByOutputType[P]>
            : GetScalarType<T[P], Question_imagesGroupByOutputType[P]>
        }
      >
    >


  export type question_imagesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question_id?: boolean
    storage_path?: boolean
    public_url?: boolean
    image_type?: boolean
    caption?: boolean
    sort_order?: boolean
    uploaded_by?: boolean
    created_at?: boolean
    display_url?: boolean
  }, ExtArgs["result"]["question_images"]>

  export type question_imagesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question_id?: boolean
    storage_path?: boolean
    public_url?: boolean
    image_type?: boolean
    caption?: boolean
    sort_order?: boolean
    uploaded_by?: boolean
    created_at?: boolean
    display_url?: boolean
  }, ExtArgs["result"]["question_images"]>

  export type question_imagesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question_id?: boolean
    storage_path?: boolean
    public_url?: boolean
    image_type?: boolean
    caption?: boolean
    sort_order?: boolean
    uploaded_by?: boolean
    created_at?: boolean
    display_url?: boolean
  }, ExtArgs["result"]["question_images"]>

  export type question_imagesSelectScalar = {
    id?: boolean
    question_id?: boolean
    storage_path?: boolean
    public_url?: boolean
    image_type?: boolean
    caption?: boolean
    sort_order?: boolean
    uploaded_by?: boolean
    created_at?: boolean
    display_url?: boolean
  }

  export type question_imagesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "question_id" | "storage_path" | "public_url" | "image_type" | "caption" | "sort_order" | "uploaded_by" | "created_at" | "display_url", ExtArgs["result"]["question_images"]>

  export type $question_imagesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "question_images"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      question_id: string
      storage_path: string
      public_url: string | null
      image_type: string
      caption: string | null
      sort_order: number
      uploaded_by: string | null
      created_at: Date | null
      display_url: string | null
    }, ExtArgs["result"]["question_images"]>
    composites: {}
  }

  type question_imagesGetPayload<S extends boolean | null | undefined | question_imagesDefaultArgs> = $Result.GetResult<Prisma.$question_imagesPayload, S>

  type question_imagesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<question_imagesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Question_imagesCountAggregateInputType | true
    }

  export interface question_imagesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['question_images'], meta: { name: 'question_images' } }
    /**
     * Find zero or one Question_images that matches the filter.
     * @param {question_imagesFindUniqueArgs} args - Arguments to find a Question_images
     * @example
     * // Get one Question_images
     * const question_images = await prisma.question_images.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends question_imagesFindUniqueArgs>(args: SelectSubset<T, question_imagesFindUniqueArgs<ExtArgs>>): Prisma__question_imagesClient<$Result.GetResult<Prisma.$question_imagesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Question_images that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {question_imagesFindUniqueOrThrowArgs} args - Arguments to find a Question_images
     * @example
     * // Get one Question_images
     * const question_images = await prisma.question_images.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends question_imagesFindUniqueOrThrowArgs>(args: SelectSubset<T, question_imagesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__question_imagesClient<$Result.GetResult<Prisma.$question_imagesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Question_images that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {question_imagesFindFirstArgs} args - Arguments to find a Question_images
     * @example
     * // Get one Question_images
     * const question_images = await prisma.question_images.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends question_imagesFindFirstArgs>(args?: SelectSubset<T, question_imagesFindFirstArgs<ExtArgs>>): Prisma__question_imagesClient<$Result.GetResult<Prisma.$question_imagesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Question_images that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {question_imagesFindFirstOrThrowArgs} args - Arguments to find a Question_images
     * @example
     * // Get one Question_images
     * const question_images = await prisma.question_images.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends question_imagesFindFirstOrThrowArgs>(args?: SelectSubset<T, question_imagesFindFirstOrThrowArgs<ExtArgs>>): Prisma__question_imagesClient<$Result.GetResult<Prisma.$question_imagesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Question_images that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {question_imagesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Question_images
     * const question_images = await prisma.question_images.findMany()
     * 
     * // Get first 10 Question_images
     * const question_images = await prisma.question_images.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const question_imagesWithIdOnly = await prisma.question_images.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends question_imagesFindManyArgs>(args?: SelectSubset<T, question_imagesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$question_imagesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Question_images.
     * @param {question_imagesCreateArgs} args - Arguments to create a Question_images.
     * @example
     * // Create one Question_images
     * const Question_images = await prisma.question_images.create({
     *   data: {
     *     // ... data to create a Question_images
     *   }
     * })
     * 
     */
    create<T extends question_imagesCreateArgs>(args: SelectSubset<T, question_imagesCreateArgs<ExtArgs>>): Prisma__question_imagesClient<$Result.GetResult<Prisma.$question_imagesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Question_images.
     * @param {question_imagesCreateManyArgs} args - Arguments to create many Question_images.
     * @example
     * // Create many Question_images
     * const question_images = await prisma.question_images.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends question_imagesCreateManyArgs>(args?: SelectSubset<T, question_imagesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Question_images and returns the data saved in the database.
     * @param {question_imagesCreateManyAndReturnArgs} args - Arguments to create many Question_images.
     * @example
     * // Create many Question_images
     * const question_images = await prisma.question_images.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Question_images and only return the `id`
     * const question_imagesWithIdOnly = await prisma.question_images.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends question_imagesCreateManyAndReturnArgs>(args?: SelectSubset<T, question_imagesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$question_imagesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Question_images.
     * @param {question_imagesDeleteArgs} args - Arguments to delete one Question_images.
     * @example
     * // Delete one Question_images
     * const Question_images = await prisma.question_images.delete({
     *   where: {
     *     // ... filter to delete one Question_images
     *   }
     * })
     * 
     */
    delete<T extends question_imagesDeleteArgs>(args: SelectSubset<T, question_imagesDeleteArgs<ExtArgs>>): Prisma__question_imagesClient<$Result.GetResult<Prisma.$question_imagesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Question_images.
     * @param {question_imagesUpdateArgs} args - Arguments to update one Question_images.
     * @example
     * // Update one Question_images
     * const question_images = await prisma.question_images.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends question_imagesUpdateArgs>(args: SelectSubset<T, question_imagesUpdateArgs<ExtArgs>>): Prisma__question_imagesClient<$Result.GetResult<Prisma.$question_imagesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Question_images.
     * @param {question_imagesDeleteManyArgs} args - Arguments to filter Question_images to delete.
     * @example
     * // Delete a few Question_images
     * const { count } = await prisma.question_images.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends question_imagesDeleteManyArgs>(args?: SelectSubset<T, question_imagesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Question_images.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {question_imagesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Question_images
     * const question_images = await prisma.question_images.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends question_imagesUpdateManyArgs>(args: SelectSubset<T, question_imagesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Question_images and returns the data updated in the database.
     * @param {question_imagesUpdateManyAndReturnArgs} args - Arguments to update many Question_images.
     * @example
     * // Update many Question_images
     * const question_images = await prisma.question_images.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Question_images and only return the `id`
     * const question_imagesWithIdOnly = await prisma.question_images.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends question_imagesUpdateManyAndReturnArgs>(args: SelectSubset<T, question_imagesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$question_imagesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Question_images.
     * @param {question_imagesUpsertArgs} args - Arguments to update or create a Question_images.
     * @example
     * // Update or create a Question_images
     * const question_images = await prisma.question_images.upsert({
     *   create: {
     *     // ... data to create a Question_images
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Question_images we want to update
     *   }
     * })
     */
    upsert<T extends question_imagesUpsertArgs>(args: SelectSubset<T, question_imagesUpsertArgs<ExtArgs>>): Prisma__question_imagesClient<$Result.GetResult<Prisma.$question_imagesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Question_images.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {question_imagesCountArgs} args - Arguments to filter Question_images to count.
     * @example
     * // Count the number of Question_images
     * const count = await prisma.question_images.count({
     *   where: {
     *     // ... the filter for the Question_images we want to count
     *   }
     * })
    **/
    count<T extends question_imagesCountArgs>(
      args?: Subset<T, question_imagesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Question_imagesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Question_images.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Question_imagesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Question_imagesAggregateArgs>(args: Subset<T, Question_imagesAggregateArgs>): Prisma.PrismaPromise<GetQuestion_imagesAggregateType<T>>

    /**
     * Group by Question_images.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {question_imagesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends question_imagesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: question_imagesGroupByArgs['orderBy'] }
        : { orderBy?: question_imagesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, question_imagesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestion_imagesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the question_images model
   */
  readonly fields: question_imagesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for question_images.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__question_imagesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the question_images model
   */
  interface question_imagesFieldRefs {
    readonly id: FieldRef<"question_images", 'String'>
    readonly question_id: FieldRef<"question_images", 'String'>
    readonly storage_path: FieldRef<"question_images", 'String'>
    readonly public_url: FieldRef<"question_images", 'String'>
    readonly image_type: FieldRef<"question_images", 'String'>
    readonly caption: FieldRef<"question_images", 'String'>
    readonly sort_order: FieldRef<"question_images", 'Int'>
    readonly uploaded_by: FieldRef<"question_images", 'String'>
    readonly created_at: FieldRef<"question_images", 'DateTime'>
    readonly display_url: FieldRef<"question_images", 'String'>
  }
    

  // Custom InputTypes
  /**
   * question_images findUnique
   */
  export type question_imagesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the question_images
     */
    select?: question_imagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the question_images
     */
    omit?: question_imagesOmit<ExtArgs> | null
    /**
     * Filter, which question_images to fetch.
     */
    where: question_imagesWhereUniqueInput
  }

  /**
   * question_images findUniqueOrThrow
   */
  export type question_imagesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the question_images
     */
    select?: question_imagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the question_images
     */
    omit?: question_imagesOmit<ExtArgs> | null
    /**
     * Filter, which question_images to fetch.
     */
    where: question_imagesWhereUniqueInput
  }

  /**
   * question_images findFirst
   */
  export type question_imagesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the question_images
     */
    select?: question_imagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the question_images
     */
    omit?: question_imagesOmit<ExtArgs> | null
    /**
     * Filter, which question_images to fetch.
     */
    where?: question_imagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of question_images to fetch.
     */
    orderBy?: question_imagesOrderByWithRelationInput | question_imagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for question_images.
     */
    cursor?: question_imagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` question_images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` question_images.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of question_images.
     */
    distinct?: Question_imagesScalarFieldEnum | Question_imagesScalarFieldEnum[]
  }

  /**
   * question_images findFirstOrThrow
   */
  export type question_imagesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the question_images
     */
    select?: question_imagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the question_images
     */
    omit?: question_imagesOmit<ExtArgs> | null
    /**
     * Filter, which question_images to fetch.
     */
    where?: question_imagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of question_images to fetch.
     */
    orderBy?: question_imagesOrderByWithRelationInput | question_imagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for question_images.
     */
    cursor?: question_imagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` question_images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` question_images.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of question_images.
     */
    distinct?: Question_imagesScalarFieldEnum | Question_imagesScalarFieldEnum[]
  }

  /**
   * question_images findMany
   */
  export type question_imagesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the question_images
     */
    select?: question_imagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the question_images
     */
    omit?: question_imagesOmit<ExtArgs> | null
    /**
     * Filter, which question_images to fetch.
     */
    where?: question_imagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of question_images to fetch.
     */
    orderBy?: question_imagesOrderByWithRelationInput | question_imagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing question_images.
     */
    cursor?: question_imagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` question_images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` question_images.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of question_images.
     */
    distinct?: Question_imagesScalarFieldEnum | Question_imagesScalarFieldEnum[]
  }

  /**
   * question_images create
   */
  export type question_imagesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the question_images
     */
    select?: question_imagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the question_images
     */
    omit?: question_imagesOmit<ExtArgs> | null
    /**
     * The data needed to create a question_images.
     */
    data: XOR<question_imagesCreateInput, question_imagesUncheckedCreateInput>
  }

  /**
   * question_images createMany
   */
  export type question_imagesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many question_images.
     */
    data: question_imagesCreateManyInput | question_imagesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * question_images createManyAndReturn
   */
  export type question_imagesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the question_images
     */
    select?: question_imagesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the question_images
     */
    omit?: question_imagesOmit<ExtArgs> | null
    /**
     * The data used to create many question_images.
     */
    data: question_imagesCreateManyInput | question_imagesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * question_images update
   */
  export type question_imagesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the question_images
     */
    select?: question_imagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the question_images
     */
    omit?: question_imagesOmit<ExtArgs> | null
    /**
     * The data needed to update a question_images.
     */
    data: XOR<question_imagesUpdateInput, question_imagesUncheckedUpdateInput>
    /**
     * Choose, which question_images to update.
     */
    where: question_imagesWhereUniqueInput
  }

  /**
   * question_images updateMany
   */
  export type question_imagesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update question_images.
     */
    data: XOR<question_imagesUpdateManyMutationInput, question_imagesUncheckedUpdateManyInput>
    /**
     * Filter which question_images to update
     */
    where?: question_imagesWhereInput
    /**
     * Limit how many question_images to update.
     */
    limit?: number
  }

  /**
   * question_images updateManyAndReturn
   */
  export type question_imagesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the question_images
     */
    select?: question_imagesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the question_images
     */
    omit?: question_imagesOmit<ExtArgs> | null
    /**
     * The data used to update question_images.
     */
    data: XOR<question_imagesUpdateManyMutationInput, question_imagesUncheckedUpdateManyInput>
    /**
     * Filter which question_images to update
     */
    where?: question_imagesWhereInput
    /**
     * Limit how many question_images to update.
     */
    limit?: number
  }

  /**
   * question_images upsert
   */
  export type question_imagesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the question_images
     */
    select?: question_imagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the question_images
     */
    omit?: question_imagesOmit<ExtArgs> | null
    /**
     * The filter to search for the question_images to update in case it exists.
     */
    where: question_imagesWhereUniqueInput
    /**
     * In case the question_images found by the `where` argument doesn't exist, create a new question_images with this data.
     */
    create: XOR<question_imagesCreateInput, question_imagesUncheckedCreateInput>
    /**
     * In case the question_images was found with the provided `where` argument, update it with this data.
     */
    update: XOR<question_imagesUpdateInput, question_imagesUncheckedUpdateInput>
  }

  /**
   * question_images delete
   */
  export type question_imagesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the question_images
     */
    select?: question_imagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the question_images
     */
    omit?: question_imagesOmit<ExtArgs> | null
    /**
     * Filter which question_images to delete.
     */
    where: question_imagesWhereUniqueInput
  }

  /**
   * question_images deleteMany
   */
  export type question_imagesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which question_images to delete
     */
    where?: question_imagesWhereInput
    /**
     * Limit how many question_images to delete.
     */
    limit?: number
  }

  /**
   * question_images without action
   */
  export type question_imagesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the question_images
     */
    select?: question_imagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the question_images
     */
    omit?: question_imagesOmit<ExtArgs> | null
  }


  /**
   * Model questions
   */

  export type AggregateQuestions = {
    _count: QuestionsCountAggregateOutputType | null
    _avg: QuestionsAvgAggregateOutputType | null
    _sum: QuestionsSumAggregateOutputType | null
    _min: QuestionsMinAggregateOutputType | null
    _max: QuestionsMaxAggregateOutputType | null
  }

  export type QuestionsAvgAggregateOutputType = {
    marks: number | null
    question_number: number | null
    source_page: number | null
    year: number | null
  }

  export type QuestionsSumAggregateOutputType = {
    marks: number | null
    question_number: number | null
    source_page: number | null
    year: number | null
  }

  export type QuestionsMinAggregateOutputType = {
    id: string | null
    content_text: string | null
    difficulty: string | null
    marks: number | null
    topic_id: string | null
    subtopic_id: string | null
    sub_subtopic_id: string | null
    exam_board_id: string | null
    status: string | null
    batch_id: string | null
    created_by: string | null
    has_image: boolean | null
    question_number: number | null
    source_page: number | null
    year: number | null
    paper: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type QuestionsMaxAggregateOutputType = {
    id: string | null
    content_text: string | null
    difficulty: string | null
    marks: number | null
    topic_id: string | null
    subtopic_id: string | null
    sub_subtopic_id: string | null
    exam_board_id: string | null
    status: string | null
    batch_id: string | null
    created_by: string | null
    has_image: boolean | null
    question_number: number | null
    source_page: number | null
    year: number | null
    paper: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type QuestionsCountAggregateOutputType = {
    id: number
    content_text: number
    difficulty: number
    marks: number
    topic_id: number
    subtopic_id: number
    sub_subtopic_id: number
    exam_board_id: number
    status: number
    batch_id: number
    created_by: number
    has_image: number
    question_number: number
    source_page: number
    year: number
    paper: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type QuestionsAvgAggregateInputType = {
    marks?: true
    question_number?: true
    source_page?: true
    year?: true
  }

  export type QuestionsSumAggregateInputType = {
    marks?: true
    question_number?: true
    source_page?: true
    year?: true
  }

  export type QuestionsMinAggregateInputType = {
    id?: true
    content_text?: true
    difficulty?: true
    marks?: true
    topic_id?: true
    subtopic_id?: true
    sub_subtopic_id?: true
    exam_board_id?: true
    status?: true
    batch_id?: true
    created_by?: true
    has_image?: true
    question_number?: true
    source_page?: true
    year?: true
    paper?: true
    created_at?: true
    updated_at?: true
  }

  export type QuestionsMaxAggregateInputType = {
    id?: true
    content_text?: true
    difficulty?: true
    marks?: true
    topic_id?: true
    subtopic_id?: true
    sub_subtopic_id?: true
    exam_board_id?: true
    status?: true
    batch_id?: true
    created_by?: true
    has_image?: true
    question_number?: true
    source_page?: true
    year?: true
    paper?: true
    created_at?: true
    updated_at?: true
  }

  export type QuestionsCountAggregateInputType = {
    id?: true
    content_text?: true
    difficulty?: true
    marks?: true
    topic_id?: true
    subtopic_id?: true
    sub_subtopic_id?: true
    exam_board_id?: true
    status?: true
    batch_id?: true
    created_by?: true
    has_image?: true
    question_number?: true
    source_page?: true
    year?: true
    paper?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type QuestionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which questions to aggregate.
     */
    where?: questionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of questions to fetch.
     */
    orderBy?: questionsOrderByWithRelationInput | questionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: questionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned questions
    **/
    _count?: true | QuestionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuestionsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuestionsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuestionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuestionsMaxAggregateInputType
  }

  export type GetQuestionsAggregateType<T extends QuestionsAggregateArgs> = {
        [P in keyof T & keyof AggregateQuestions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuestions[P]>
      : GetScalarType<T[P], AggregateQuestions[P]>
  }




  export type questionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: questionsWhereInput
    orderBy?: questionsOrderByWithAggregationInput | questionsOrderByWithAggregationInput[]
    by: QuestionsScalarFieldEnum[] | QuestionsScalarFieldEnum
    having?: questionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuestionsCountAggregateInputType | true
    _avg?: QuestionsAvgAggregateInputType
    _sum?: QuestionsSumAggregateInputType
    _min?: QuestionsMinAggregateInputType
    _max?: QuestionsMaxAggregateInputType
  }

  export type QuestionsGroupByOutputType = {
    id: string
    content_text: string | null
    difficulty: string | null
    marks: number | null
    topic_id: string | null
    subtopic_id: string | null
    sub_subtopic_id: string | null
    exam_board_id: string | null
    status: string | null
    batch_id: string | null
    created_by: string | null
    has_image: boolean | null
    question_number: number | null
    source_page: number | null
    year: number | null
    paper: string | null
    created_at: Date | null
    updated_at: Date | null
    _count: QuestionsCountAggregateOutputType | null
    _avg: QuestionsAvgAggregateOutputType | null
    _sum: QuestionsSumAggregateOutputType | null
    _min: QuestionsMinAggregateOutputType | null
    _max: QuestionsMaxAggregateOutputType | null
  }

  type GetQuestionsGroupByPayload<T extends questionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuestionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuestionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuestionsGroupByOutputType[P]>
            : GetScalarType<T[P], QuestionsGroupByOutputType[P]>
        }
      >
    >


  export type questionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content_text?: boolean
    difficulty?: boolean
    marks?: boolean
    topic_id?: boolean
    subtopic_id?: boolean
    sub_subtopic_id?: boolean
    exam_board_id?: boolean
    status?: boolean
    batch_id?: boolean
    created_by?: boolean
    has_image?: boolean
    question_number?: boolean
    source_page?: boolean
    year?: boolean
    paper?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["questions"]>

  export type questionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content_text?: boolean
    difficulty?: boolean
    marks?: boolean
    topic_id?: boolean
    subtopic_id?: boolean
    sub_subtopic_id?: boolean
    exam_board_id?: boolean
    status?: boolean
    batch_id?: boolean
    created_by?: boolean
    has_image?: boolean
    question_number?: boolean
    source_page?: boolean
    year?: boolean
    paper?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["questions"]>

  export type questionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content_text?: boolean
    difficulty?: boolean
    marks?: boolean
    topic_id?: boolean
    subtopic_id?: boolean
    sub_subtopic_id?: boolean
    exam_board_id?: boolean
    status?: boolean
    batch_id?: boolean
    created_by?: boolean
    has_image?: boolean
    question_number?: boolean
    source_page?: boolean
    year?: boolean
    paper?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["questions"]>

  export type questionsSelectScalar = {
    id?: boolean
    content_text?: boolean
    difficulty?: boolean
    marks?: boolean
    topic_id?: boolean
    subtopic_id?: boolean
    sub_subtopic_id?: boolean
    exam_board_id?: boolean
    status?: boolean
    batch_id?: boolean
    created_by?: boolean
    has_image?: boolean
    question_number?: boolean
    source_page?: boolean
    year?: boolean
    paper?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type questionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content_text" | "difficulty" | "marks" | "topic_id" | "subtopic_id" | "sub_subtopic_id" | "exam_board_id" | "status" | "batch_id" | "created_by" | "has_image" | "question_number" | "source_page" | "year" | "paper" | "created_at" | "updated_at", ExtArgs["result"]["questions"]>

  export type $questionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "questions"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content_text: string | null
      difficulty: string | null
      marks: number | null
      topic_id: string | null
      subtopic_id: string | null
      sub_subtopic_id: string | null
      exam_board_id: string | null
      status: string | null
      batch_id: string | null
      created_by: string | null
      has_image: boolean | null
      question_number: number | null
      source_page: number | null
      year: number | null
      paper: string | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["questions"]>
    composites: {}
  }

  type questionsGetPayload<S extends boolean | null | undefined | questionsDefaultArgs> = $Result.GetResult<Prisma.$questionsPayload, S>

  type questionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<questionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuestionsCountAggregateInputType | true
    }

  export interface questionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['questions'], meta: { name: 'questions' } }
    /**
     * Find zero or one Questions that matches the filter.
     * @param {questionsFindUniqueArgs} args - Arguments to find a Questions
     * @example
     * // Get one Questions
     * const questions = await prisma.questions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends questionsFindUniqueArgs>(args: SelectSubset<T, questionsFindUniqueArgs<ExtArgs>>): Prisma__questionsClient<$Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Questions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {questionsFindUniqueOrThrowArgs} args - Arguments to find a Questions
     * @example
     * // Get one Questions
     * const questions = await prisma.questions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends questionsFindUniqueOrThrowArgs>(args: SelectSubset<T, questionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__questionsClient<$Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Questions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {questionsFindFirstArgs} args - Arguments to find a Questions
     * @example
     * // Get one Questions
     * const questions = await prisma.questions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends questionsFindFirstArgs>(args?: SelectSubset<T, questionsFindFirstArgs<ExtArgs>>): Prisma__questionsClient<$Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Questions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {questionsFindFirstOrThrowArgs} args - Arguments to find a Questions
     * @example
     * // Get one Questions
     * const questions = await prisma.questions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends questionsFindFirstOrThrowArgs>(args?: SelectSubset<T, questionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__questionsClient<$Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Questions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {questionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Questions
     * const questions = await prisma.questions.findMany()
     * 
     * // Get first 10 Questions
     * const questions = await prisma.questions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const questionsWithIdOnly = await prisma.questions.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends questionsFindManyArgs>(args?: SelectSubset<T, questionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Questions.
     * @param {questionsCreateArgs} args - Arguments to create a Questions.
     * @example
     * // Create one Questions
     * const Questions = await prisma.questions.create({
     *   data: {
     *     // ... data to create a Questions
     *   }
     * })
     * 
     */
    create<T extends questionsCreateArgs>(args: SelectSubset<T, questionsCreateArgs<ExtArgs>>): Prisma__questionsClient<$Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Questions.
     * @param {questionsCreateManyArgs} args - Arguments to create many Questions.
     * @example
     * // Create many Questions
     * const questions = await prisma.questions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends questionsCreateManyArgs>(args?: SelectSubset<T, questionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Questions and returns the data saved in the database.
     * @param {questionsCreateManyAndReturnArgs} args - Arguments to create many Questions.
     * @example
     * // Create many Questions
     * const questions = await prisma.questions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Questions and only return the `id`
     * const questionsWithIdOnly = await prisma.questions.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends questionsCreateManyAndReturnArgs>(args?: SelectSubset<T, questionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Questions.
     * @param {questionsDeleteArgs} args - Arguments to delete one Questions.
     * @example
     * // Delete one Questions
     * const Questions = await prisma.questions.delete({
     *   where: {
     *     // ... filter to delete one Questions
     *   }
     * })
     * 
     */
    delete<T extends questionsDeleteArgs>(args: SelectSubset<T, questionsDeleteArgs<ExtArgs>>): Prisma__questionsClient<$Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Questions.
     * @param {questionsUpdateArgs} args - Arguments to update one Questions.
     * @example
     * // Update one Questions
     * const questions = await prisma.questions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends questionsUpdateArgs>(args: SelectSubset<T, questionsUpdateArgs<ExtArgs>>): Prisma__questionsClient<$Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Questions.
     * @param {questionsDeleteManyArgs} args - Arguments to filter Questions to delete.
     * @example
     * // Delete a few Questions
     * const { count } = await prisma.questions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends questionsDeleteManyArgs>(args?: SelectSubset<T, questionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {questionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Questions
     * const questions = await prisma.questions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends questionsUpdateManyArgs>(args: SelectSubset<T, questionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questions and returns the data updated in the database.
     * @param {questionsUpdateManyAndReturnArgs} args - Arguments to update many Questions.
     * @example
     * // Update many Questions
     * const questions = await prisma.questions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Questions and only return the `id`
     * const questionsWithIdOnly = await prisma.questions.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends questionsUpdateManyAndReturnArgs>(args: SelectSubset<T, questionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Questions.
     * @param {questionsUpsertArgs} args - Arguments to update or create a Questions.
     * @example
     * // Update or create a Questions
     * const questions = await prisma.questions.upsert({
     *   create: {
     *     // ... data to create a Questions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Questions we want to update
     *   }
     * })
     */
    upsert<T extends questionsUpsertArgs>(args: SelectSubset<T, questionsUpsertArgs<ExtArgs>>): Prisma__questionsClient<$Result.GetResult<Prisma.$questionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {questionsCountArgs} args - Arguments to filter Questions to count.
     * @example
     * // Count the number of Questions
     * const count = await prisma.questions.count({
     *   where: {
     *     // ... the filter for the Questions we want to count
     *   }
     * })
    **/
    count<T extends questionsCountArgs>(
      args?: Subset<T, questionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuestionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuestionsAggregateArgs>(args: Subset<T, QuestionsAggregateArgs>): Prisma.PrismaPromise<GetQuestionsAggregateType<T>>

    /**
     * Group by Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {questionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends questionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: questionsGroupByArgs['orderBy'] }
        : { orderBy?: questionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, questionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the questions model
   */
  readonly fields: questionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for questions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__questionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the questions model
   */
  interface questionsFieldRefs {
    readonly id: FieldRef<"questions", 'String'>
    readonly content_text: FieldRef<"questions", 'String'>
    readonly difficulty: FieldRef<"questions", 'String'>
    readonly marks: FieldRef<"questions", 'Int'>
    readonly topic_id: FieldRef<"questions", 'String'>
    readonly subtopic_id: FieldRef<"questions", 'String'>
    readonly sub_subtopic_id: FieldRef<"questions", 'String'>
    readonly exam_board_id: FieldRef<"questions", 'String'>
    readonly status: FieldRef<"questions", 'String'>
    readonly batch_id: FieldRef<"questions", 'String'>
    readonly created_by: FieldRef<"questions", 'String'>
    readonly has_image: FieldRef<"questions", 'Boolean'>
    readonly question_number: FieldRef<"questions", 'Int'>
    readonly source_page: FieldRef<"questions", 'Int'>
    readonly year: FieldRef<"questions", 'Int'>
    readonly paper: FieldRef<"questions", 'String'>
    readonly created_at: FieldRef<"questions", 'DateTime'>
    readonly updated_at: FieldRef<"questions", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * questions findUnique
   */
  export type questionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the questions
     */
    omit?: questionsOmit<ExtArgs> | null
    /**
     * Filter, which questions to fetch.
     */
    where: questionsWhereUniqueInput
  }

  /**
   * questions findUniqueOrThrow
   */
  export type questionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the questions
     */
    omit?: questionsOmit<ExtArgs> | null
    /**
     * Filter, which questions to fetch.
     */
    where: questionsWhereUniqueInput
  }

  /**
   * questions findFirst
   */
  export type questionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the questions
     */
    omit?: questionsOmit<ExtArgs> | null
    /**
     * Filter, which questions to fetch.
     */
    where?: questionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of questions to fetch.
     */
    orderBy?: questionsOrderByWithRelationInput | questionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for questions.
     */
    cursor?: questionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of questions.
     */
    distinct?: QuestionsScalarFieldEnum | QuestionsScalarFieldEnum[]
  }

  /**
   * questions findFirstOrThrow
   */
  export type questionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the questions
     */
    omit?: questionsOmit<ExtArgs> | null
    /**
     * Filter, which questions to fetch.
     */
    where?: questionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of questions to fetch.
     */
    orderBy?: questionsOrderByWithRelationInput | questionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for questions.
     */
    cursor?: questionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of questions.
     */
    distinct?: QuestionsScalarFieldEnum | QuestionsScalarFieldEnum[]
  }

  /**
   * questions findMany
   */
  export type questionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the questions
     */
    omit?: questionsOmit<ExtArgs> | null
    /**
     * Filter, which questions to fetch.
     */
    where?: questionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of questions to fetch.
     */
    orderBy?: questionsOrderByWithRelationInput | questionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing questions.
     */
    cursor?: questionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of questions.
     */
    distinct?: QuestionsScalarFieldEnum | QuestionsScalarFieldEnum[]
  }

  /**
   * questions create
   */
  export type questionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the questions
     */
    omit?: questionsOmit<ExtArgs> | null
    /**
     * The data needed to create a questions.
     */
    data?: XOR<questionsCreateInput, questionsUncheckedCreateInput>
  }

  /**
   * questions createMany
   */
  export type questionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many questions.
     */
    data: questionsCreateManyInput | questionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * questions createManyAndReturn
   */
  export type questionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: questionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the questions
     */
    omit?: questionsOmit<ExtArgs> | null
    /**
     * The data used to create many questions.
     */
    data: questionsCreateManyInput | questionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * questions update
   */
  export type questionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the questions
     */
    omit?: questionsOmit<ExtArgs> | null
    /**
     * The data needed to update a questions.
     */
    data: XOR<questionsUpdateInput, questionsUncheckedUpdateInput>
    /**
     * Choose, which questions to update.
     */
    where: questionsWhereUniqueInput
  }

  /**
   * questions updateMany
   */
  export type questionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update questions.
     */
    data: XOR<questionsUpdateManyMutationInput, questionsUncheckedUpdateManyInput>
    /**
     * Filter which questions to update
     */
    where?: questionsWhereInput
    /**
     * Limit how many questions to update.
     */
    limit?: number
  }

  /**
   * questions updateManyAndReturn
   */
  export type questionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: questionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the questions
     */
    omit?: questionsOmit<ExtArgs> | null
    /**
     * The data used to update questions.
     */
    data: XOR<questionsUpdateManyMutationInput, questionsUncheckedUpdateManyInput>
    /**
     * Filter which questions to update
     */
    where?: questionsWhereInput
    /**
     * Limit how many questions to update.
     */
    limit?: number
  }

  /**
   * questions upsert
   */
  export type questionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the questions
     */
    omit?: questionsOmit<ExtArgs> | null
    /**
     * The filter to search for the questions to update in case it exists.
     */
    where: questionsWhereUniqueInput
    /**
     * In case the questions found by the `where` argument doesn't exist, create a new questions with this data.
     */
    create: XOR<questionsCreateInput, questionsUncheckedCreateInput>
    /**
     * In case the questions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<questionsUpdateInput, questionsUncheckedUpdateInput>
  }

  /**
   * questions delete
   */
  export type questionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the questions
     */
    omit?: questionsOmit<ExtArgs> | null
    /**
     * Filter which questions to delete.
     */
    where: questionsWhereUniqueInput
  }

  /**
   * questions deleteMany
   */
  export type questionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which questions to delete
     */
    where?: questionsWhereInput
    /**
     * Limit how many questions to delete.
     */
    limit?: number
  }

  /**
   * questions without action
   */
  export type questionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the questions
     */
    select?: questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the questions
     */
    omit?: questionsOmit<ExtArgs> | null
  }


  /**
   * Model sub_subtopics
   */

  export type AggregateSub_subtopics = {
    _count: Sub_subtopicsCountAggregateOutputType | null
    _avg: Sub_subtopicsAvgAggregateOutputType | null
    _sum: Sub_subtopicsSumAggregateOutputType | null
    _min: Sub_subtopicsMinAggregateOutputType | null
    _max: Sub_subtopicsMaxAggregateOutputType | null
  }

  export type Sub_subtopicsAvgAggregateOutputType = {
    ext_num: number | null
    core_num: number | null
    sort_order: number | null
  }

  export type Sub_subtopicsSumAggregateOutputType = {
    ext_num: number | null
    core_num: number | null
    sort_order: number | null
  }

  export type Sub_subtopicsMinAggregateOutputType = {
    id: string | null
    subtopic_id: string | null
    ext_num: number | null
    core_num: number | null
    outcome: string | null
    tier: string | null
    notes: string | null
    sort_order: number | null
    created_at: Date | null
  }

  export type Sub_subtopicsMaxAggregateOutputType = {
    id: string | null
    subtopic_id: string | null
    ext_num: number | null
    core_num: number | null
    outcome: string | null
    tier: string | null
    notes: string | null
    sort_order: number | null
    created_at: Date | null
  }

  export type Sub_subtopicsCountAggregateOutputType = {
    id: number
    subtopic_id: number
    ext_num: number
    core_num: number
    outcome: number
    tier: number
    notes: number
    sort_order: number
    created_at: number
    _all: number
  }


  export type Sub_subtopicsAvgAggregateInputType = {
    ext_num?: true
    core_num?: true
    sort_order?: true
  }

  export type Sub_subtopicsSumAggregateInputType = {
    ext_num?: true
    core_num?: true
    sort_order?: true
  }

  export type Sub_subtopicsMinAggregateInputType = {
    id?: true
    subtopic_id?: true
    ext_num?: true
    core_num?: true
    outcome?: true
    tier?: true
    notes?: true
    sort_order?: true
    created_at?: true
  }

  export type Sub_subtopicsMaxAggregateInputType = {
    id?: true
    subtopic_id?: true
    ext_num?: true
    core_num?: true
    outcome?: true
    tier?: true
    notes?: true
    sort_order?: true
    created_at?: true
  }

  export type Sub_subtopicsCountAggregateInputType = {
    id?: true
    subtopic_id?: true
    ext_num?: true
    core_num?: true
    outcome?: true
    tier?: true
    notes?: true
    sort_order?: true
    created_at?: true
    _all?: true
  }

  export type Sub_subtopicsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sub_subtopics to aggregate.
     */
    where?: sub_subtopicsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sub_subtopics to fetch.
     */
    orderBy?: sub_subtopicsOrderByWithRelationInput | sub_subtopicsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: sub_subtopicsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sub_subtopics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sub_subtopics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned sub_subtopics
    **/
    _count?: true | Sub_subtopicsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Sub_subtopicsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Sub_subtopicsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Sub_subtopicsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Sub_subtopicsMaxAggregateInputType
  }

  export type GetSub_subtopicsAggregateType<T extends Sub_subtopicsAggregateArgs> = {
        [P in keyof T & keyof AggregateSub_subtopics]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSub_subtopics[P]>
      : GetScalarType<T[P], AggregateSub_subtopics[P]>
  }




  export type sub_subtopicsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: sub_subtopicsWhereInput
    orderBy?: sub_subtopicsOrderByWithAggregationInput | sub_subtopicsOrderByWithAggregationInput[]
    by: Sub_subtopicsScalarFieldEnum[] | Sub_subtopicsScalarFieldEnum
    having?: sub_subtopicsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Sub_subtopicsCountAggregateInputType | true
    _avg?: Sub_subtopicsAvgAggregateInputType
    _sum?: Sub_subtopicsSumAggregateInputType
    _min?: Sub_subtopicsMinAggregateInputType
    _max?: Sub_subtopicsMaxAggregateInputType
  }

  export type Sub_subtopicsGroupByOutputType = {
    id: string
    subtopic_id: string
    ext_num: number
    core_num: number | null
    outcome: string
    tier: string
    notes: string | null
    sort_order: number
    created_at: Date | null
    _count: Sub_subtopicsCountAggregateOutputType | null
    _avg: Sub_subtopicsAvgAggregateOutputType | null
    _sum: Sub_subtopicsSumAggregateOutputType | null
    _min: Sub_subtopicsMinAggregateOutputType | null
    _max: Sub_subtopicsMaxAggregateOutputType | null
  }

  type GetSub_subtopicsGroupByPayload<T extends sub_subtopicsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Sub_subtopicsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Sub_subtopicsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Sub_subtopicsGroupByOutputType[P]>
            : GetScalarType<T[P], Sub_subtopicsGroupByOutputType[P]>
        }
      >
    >


  export type sub_subtopicsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subtopic_id?: boolean
    ext_num?: boolean
    core_num?: boolean
    outcome?: boolean
    tier?: boolean
    notes?: boolean
    sort_order?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["sub_subtopics"]>

  export type sub_subtopicsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subtopic_id?: boolean
    ext_num?: boolean
    core_num?: boolean
    outcome?: boolean
    tier?: boolean
    notes?: boolean
    sort_order?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["sub_subtopics"]>

  export type sub_subtopicsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subtopic_id?: boolean
    ext_num?: boolean
    core_num?: boolean
    outcome?: boolean
    tier?: boolean
    notes?: boolean
    sort_order?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["sub_subtopics"]>

  export type sub_subtopicsSelectScalar = {
    id?: boolean
    subtopic_id?: boolean
    ext_num?: boolean
    core_num?: boolean
    outcome?: boolean
    tier?: boolean
    notes?: boolean
    sort_order?: boolean
    created_at?: boolean
  }

  export type sub_subtopicsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "subtopic_id" | "ext_num" | "core_num" | "outcome" | "tier" | "notes" | "sort_order" | "created_at", ExtArgs["result"]["sub_subtopics"]>

  export type $sub_subtopicsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "sub_subtopics"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      subtopic_id: string
      ext_num: number
      core_num: number | null
      outcome: string
      tier: string
      notes: string | null
      sort_order: number
      created_at: Date | null
    }, ExtArgs["result"]["sub_subtopics"]>
    composites: {}
  }

  type sub_subtopicsGetPayload<S extends boolean | null | undefined | sub_subtopicsDefaultArgs> = $Result.GetResult<Prisma.$sub_subtopicsPayload, S>

  type sub_subtopicsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<sub_subtopicsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Sub_subtopicsCountAggregateInputType | true
    }

  export interface sub_subtopicsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['sub_subtopics'], meta: { name: 'sub_subtopics' } }
    /**
     * Find zero or one Sub_subtopics that matches the filter.
     * @param {sub_subtopicsFindUniqueArgs} args - Arguments to find a Sub_subtopics
     * @example
     * // Get one Sub_subtopics
     * const sub_subtopics = await prisma.sub_subtopics.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends sub_subtopicsFindUniqueArgs>(args: SelectSubset<T, sub_subtopicsFindUniqueArgs<ExtArgs>>): Prisma__sub_subtopicsClient<$Result.GetResult<Prisma.$sub_subtopicsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Sub_subtopics that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {sub_subtopicsFindUniqueOrThrowArgs} args - Arguments to find a Sub_subtopics
     * @example
     * // Get one Sub_subtopics
     * const sub_subtopics = await prisma.sub_subtopics.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends sub_subtopicsFindUniqueOrThrowArgs>(args: SelectSubset<T, sub_subtopicsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__sub_subtopicsClient<$Result.GetResult<Prisma.$sub_subtopicsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sub_subtopics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sub_subtopicsFindFirstArgs} args - Arguments to find a Sub_subtopics
     * @example
     * // Get one Sub_subtopics
     * const sub_subtopics = await prisma.sub_subtopics.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends sub_subtopicsFindFirstArgs>(args?: SelectSubset<T, sub_subtopicsFindFirstArgs<ExtArgs>>): Prisma__sub_subtopicsClient<$Result.GetResult<Prisma.$sub_subtopicsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sub_subtopics that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sub_subtopicsFindFirstOrThrowArgs} args - Arguments to find a Sub_subtopics
     * @example
     * // Get one Sub_subtopics
     * const sub_subtopics = await prisma.sub_subtopics.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends sub_subtopicsFindFirstOrThrowArgs>(args?: SelectSubset<T, sub_subtopicsFindFirstOrThrowArgs<ExtArgs>>): Prisma__sub_subtopicsClient<$Result.GetResult<Prisma.$sub_subtopicsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sub_subtopics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sub_subtopicsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sub_subtopics
     * const sub_subtopics = await prisma.sub_subtopics.findMany()
     * 
     * // Get first 10 Sub_subtopics
     * const sub_subtopics = await prisma.sub_subtopics.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sub_subtopicsWithIdOnly = await prisma.sub_subtopics.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends sub_subtopicsFindManyArgs>(args?: SelectSubset<T, sub_subtopicsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sub_subtopicsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Sub_subtopics.
     * @param {sub_subtopicsCreateArgs} args - Arguments to create a Sub_subtopics.
     * @example
     * // Create one Sub_subtopics
     * const Sub_subtopics = await prisma.sub_subtopics.create({
     *   data: {
     *     // ... data to create a Sub_subtopics
     *   }
     * })
     * 
     */
    create<T extends sub_subtopicsCreateArgs>(args: SelectSubset<T, sub_subtopicsCreateArgs<ExtArgs>>): Prisma__sub_subtopicsClient<$Result.GetResult<Prisma.$sub_subtopicsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sub_subtopics.
     * @param {sub_subtopicsCreateManyArgs} args - Arguments to create many Sub_subtopics.
     * @example
     * // Create many Sub_subtopics
     * const sub_subtopics = await prisma.sub_subtopics.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends sub_subtopicsCreateManyArgs>(args?: SelectSubset<T, sub_subtopicsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sub_subtopics and returns the data saved in the database.
     * @param {sub_subtopicsCreateManyAndReturnArgs} args - Arguments to create many Sub_subtopics.
     * @example
     * // Create many Sub_subtopics
     * const sub_subtopics = await prisma.sub_subtopics.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sub_subtopics and only return the `id`
     * const sub_subtopicsWithIdOnly = await prisma.sub_subtopics.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends sub_subtopicsCreateManyAndReturnArgs>(args?: SelectSubset<T, sub_subtopicsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sub_subtopicsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Sub_subtopics.
     * @param {sub_subtopicsDeleteArgs} args - Arguments to delete one Sub_subtopics.
     * @example
     * // Delete one Sub_subtopics
     * const Sub_subtopics = await prisma.sub_subtopics.delete({
     *   where: {
     *     // ... filter to delete one Sub_subtopics
     *   }
     * })
     * 
     */
    delete<T extends sub_subtopicsDeleteArgs>(args: SelectSubset<T, sub_subtopicsDeleteArgs<ExtArgs>>): Prisma__sub_subtopicsClient<$Result.GetResult<Prisma.$sub_subtopicsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Sub_subtopics.
     * @param {sub_subtopicsUpdateArgs} args - Arguments to update one Sub_subtopics.
     * @example
     * // Update one Sub_subtopics
     * const sub_subtopics = await prisma.sub_subtopics.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends sub_subtopicsUpdateArgs>(args: SelectSubset<T, sub_subtopicsUpdateArgs<ExtArgs>>): Prisma__sub_subtopicsClient<$Result.GetResult<Prisma.$sub_subtopicsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sub_subtopics.
     * @param {sub_subtopicsDeleteManyArgs} args - Arguments to filter Sub_subtopics to delete.
     * @example
     * // Delete a few Sub_subtopics
     * const { count } = await prisma.sub_subtopics.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends sub_subtopicsDeleteManyArgs>(args?: SelectSubset<T, sub_subtopicsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sub_subtopics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sub_subtopicsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sub_subtopics
     * const sub_subtopics = await prisma.sub_subtopics.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends sub_subtopicsUpdateManyArgs>(args: SelectSubset<T, sub_subtopicsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sub_subtopics and returns the data updated in the database.
     * @param {sub_subtopicsUpdateManyAndReturnArgs} args - Arguments to update many Sub_subtopics.
     * @example
     * // Update many Sub_subtopics
     * const sub_subtopics = await prisma.sub_subtopics.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sub_subtopics and only return the `id`
     * const sub_subtopicsWithIdOnly = await prisma.sub_subtopics.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends sub_subtopicsUpdateManyAndReturnArgs>(args: SelectSubset<T, sub_subtopicsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sub_subtopicsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Sub_subtopics.
     * @param {sub_subtopicsUpsertArgs} args - Arguments to update or create a Sub_subtopics.
     * @example
     * // Update or create a Sub_subtopics
     * const sub_subtopics = await prisma.sub_subtopics.upsert({
     *   create: {
     *     // ... data to create a Sub_subtopics
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sub_subtopics we want to update
     *   }
     * })
     */
    upsert<T extends sub_subtopicsUpsertArgs>(args: SelectSubset<T, sub_subtopicsUpsertArgs<ExtArgs>>): Prisma__sub_subtopicsClient<$Result.GetResult<Prisma.$sub_subtopicsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sub_subtopics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sub_subtopicsCountArgs} args - Arguments to filter Sub_subtopics to count.
     * @example
     * // Count the number of Sub_subtopics
     * const count = await prisma.sub_subtopics.count({
     *   where: {
     *     // ... the filter for the Sub_subtopics we want to count
     *   }
     * })
    **/
    count<T extends sub_subtopicsCountArgs>(
      args?: Subset<T, sub_subtopicsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Sub_subtopicsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sub_subtopics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Sub_subtopicsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Sub_subtopicsAggregateArgs>(args: Subset<T, Sub_subtopicsAggregateArgs>): Prisma.PrismaPromise<GetSub_subtopicsAggregateType<T>>

    /**
     * Group by Sub_subtopics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sub_subtopicsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends sub_subtopicsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: sub_subtopicsGroupByArgs['orderBy'] }
        : { orderBy?: sub_subtopicsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, sub_subtopicsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSub_subtopicsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the sub_subtopics model
   */
  readonly fields: sub_subtopicsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for sub_subtopics.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__sub_subtopicsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the sub_subtopics model
   */
  interface sub_subtopicsFieldRefs {
    readonly id: FieldRef<"sub_subtopics", 'String'>
    readonly subtopic_id: FieldRef<"sub_subtopics", 'String'>
    readonly ext_num: FieldRef<"sub_subtopics", 'Int'>
    readonly core_num: FieldRef<"sub_subtopics", 'Int'>
    readonly outcome: FieldRef<"sub_subtopics", 'String'>
    readonly tier: FieldRef<"sub_subtopics", 'String'>
    readonly notes: FieldRef<"sub_subtopics", 'String'>
    readonly sort_order: FieldRef<"sub_subtopics", 'Int'>
    readonly created_at: FieldRef<"sub_subtopics", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * sub_subtopics findUnique
   */
  export type sub_subtopicsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_subtopics
     */
    select?: sub_subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_subtopics
     */
    omit?: sub_subtopicsOmit<ExtArgs> | null
    /**
     * Filter, which sub_subtopics to fetch.
     */
    where: sub_subtopicsWhereUniqueInput
  }

  /**
   * sub_subtopics findUniqueOrThrow
   */
  export type sub_subtopicsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_subtopics
     */
    select?: sub_subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_subtopics
     */
    omit?: sub_subtopicsOmit<ExtArgs> | null
    /**
     * Filter, which sub_subtopics to fetch.
     */
    where: sub_subtopicsWhereUniqueInput
  }

  /**
   * sub_subtopics findFirst
   */
  export type sub_subtopicsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_subtopics
     */
    select?: sub_subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_subtopics
     */
    omit?: sub_subtopicsOmit<ExtArgs> | null
    /**
     * Filter, which sub_subtopics to fetch.
     */
    where?: sub_subtopicsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sub_subtopics to fetch.
     */
    orderBy?: sub_subtopicsOrderByWithRelationInput | sub_subtopicsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sub_subtopics.
     */
    cursor?: sub_subtopicsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sub_subtopics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sub_subtopics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sub_subtopics.
     */
    distinct?: Sub_subtopicsScalarFieldEnum | Sub_subtopicsScalarFieldEnum[]
  }

  /**
   * sub_subtopics findFirstOrThrow
   */
  export type sub_subtopicsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_subtopics
     */
    select?: sub_subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_subtopics
     */
    omit?: sub_subtopicsOmit<ExtArgs> | null
    /**
     * Filter, which sub_subtopics to fetch.
     */
    where?: sub_subtopicsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sub_subtopics to fetch.
     */
    orderBy?: sub_subtopicsOrderByWithRelationInput | sub_subtopicsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sub_subtopics.
     */
    cursor?: sub_subtopicsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sub_subtopics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sub_subtopics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sub_subtopics.
     */
    distinct?: Sub_subtopicsScalarFieldEnum | Sub_subtopicsScalarFieldEnum[]
  }

  /**
   * sub_subtopics findMany
   */
  export type sub_subtopicsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_subtopics
     */
    select?: sub_subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_subtopics
     */
    omit?: sub_subtopicsOmit<ExtArgs> | null
    /**
     * Filter, which sub_subtopics to fetch.
     */
    where?: sub_subtopicsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sub_subtopics to fetch.
     */
    orderBy?: sub_subtopicsOrderByWithRelationInput | sub_subtopicsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing sub_subtopics.
     */
    cursor?: sub_subtopicsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sub_subtopics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sub_subtopics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sub_subtopics.
     */
    distinct?: Sub_subtopicsScalarFieldEnum | Sub_subtopicsScalarFieldEnum[]
  }

  /**
   * sub_subtopics create
   */
  export type sub_subtopicsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_subtopics
     */
    select?: sub_subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_subtopics
     */
    omit?: sub_subtopicsOmit<ExtArgs> | null
    /**
     * The data needed to create a sub_subtopics.
     */
    data: XOR<sub_subtopicsCreateInput, sub_subtopicsUncheckedCreateInput>
  }

  /**
   * sub_subtopics createMany
   */
  export type sub_subtopicsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many sub_subtopics.
     */
    data: sub_subtopicsCreateManyInput | sub_subtopicsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * sub_subtopics createManyAndReturn
   */
  export type sub_subtopicsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_subtopics
     */
    select?: sub_subtopicsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the sub_subtopics
     */
    omit?: sub_subtopicsOmit<ExtArgs> | null
    /**
     * The data used to create many sub_subtopics.
     */
    data: sub_subtopicsCreateManyInput | sub_subtopicsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * sub_subtopics update
   */
  export type sub_subtopicsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_subtopics
     */
    select?: sub_subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_subtopics
     */
    omit?: sub_subtopicsOmit<ExtArgs> | null
    /**
     * The data needed to update a sub_subtopics.
     */
    data: XOR<sub_subtopicsUpdateInput, sub_subtopicsUncheckedUpdateInput>
    /**
     * Choose, which sub_subtopics to update.
     */
    where: sub_subtopicsWhereUniqueInput
  }

  /**
   * sub_subtopics updateMany
   */
  export type sub_subtopicsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update sub_subtopics.
     */
    data: XOR<sub_subtopicsUpdateManyMutationInput, sub_subtopicsUncheckedUpdateManyInput>
    /**
     * Filter which sub_subtopics to update
     */
    where?: sub_subtopicsWhereInput
    /**
     * Limit how many sub_subtopics to update.
     */
    limit?: number
  }

  /**
   * sub_subtopics updateManyAndReturn
   */
  export type sub_subtopicsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_subtopics
     */
    select?: sub_subtopicsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the sub_subtopics
     */
    omit?: sub_subtopicsOmit<ExtArgs> | null
    /**
     * The data used to update sub_subtopics.
     */
    data: XOR<sub_subtopicsUpdateManyMutationInput, sub_subtopicsUncheckedUpdateManyInput>
    /**
     * Filter which sub_subtopics to update
     */
    where?: sub_subtopicsWhereInput
    /**
     * Limit how many sub_subtopics to update.
     */
    limit?: number
  }

  /**
   * sub_subtopics upsert
   */
  export type sub_subtopicsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_subtopics
     */
    select?: sub_subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_subtopics
     */
    omit?: sub_subtopicsOmit<ExtArgs> | null
    /**
     * The filter to search for the sub_subtopics to update in case it exists.
     */
    where: sub_subtopicsWhereUniqueInput
    /**
     * In case the sub_subtopics found by the `where` argument doesn't exist, create a new sub_subtopics with this data.
     */
    create: XOR<sub_subtopicsCreateInput, sub_subtopicsUncheckedCreateInput>
    /**
     * In case the sub_subtopics was found with the provided `where` argument, update it with this data.
     */
    update: XOR<sub_subtopicsUpdateInput, sub_subtopicsUncheckedUpdateInput>
  }

  /**
   * sub_subtopics delete
   */
  export type sub_subtopicsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_subtopics
     */
    select?: sub_subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_subtopics
     */
    omit?: sub_subtopicsOmit<ExtArgs> | null
    /**
     * Filter which sub_subtopics to delete.
     */
    where: sub_subtopicsWhereUniqueInput
  }

  /**
   * sub_subtopics deleteMany
   */
  export type sub_subtopicsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sub_subtopics to delete
     */
    where?: sub_subtopicsWhereInput
    /**
     * Limit how many sub_subtopics to delete.
     */
    limit?: number
  }

  /**
   * sub_subtopics without action
   */
  export type sub_subtopicsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sub_subtopics
     */
    select?: sub_subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sub_subtopics
     */
    omit?: sub_subtopicsOmit<ExtArgs> | null
  }


  /**
   * Model subtopics
   */

  export type AggregateSubtopics = {
    _count: SubtopicsCountAggregateOutputType | null
    _avg: SubtopicsAvgAggregateOutputType | null
    _sum: SubtopicsSumAggregateOutputType | null
    _min: SubtopicsMinAggregateOutputType | null
    _max: SubtopicsMaxAggregateOutputType | null
  }

  export type SubtopicsAvgAggregateOutputType = {
    qs_total: number | null
    mcq_count: number | null
    short_ans_count: number | null
    structured_count: number | null
    extended_count: number | null
    sort_order: number | null
    examples_required: number | null
  }

  export type SubtopicsSumAggregateOutputType = {
    qs_total: number | null
    mcq_count: number | null
    short_ans_count: number | null
    structured_count: number | null
    extended_count: number | null
    sort_order: number | null
    examples_required: number | null
  }

  export type SubtopicsMinAggregateOutputType = {
    id: string | null
    topic_id: string | null
    ref: string | null
    title: string | null
    due_date: Date | null
    sprint_week: string | null
    qs_total: number | null
    mcq_count: number | null
    short_ans_count: number | null
    structured_count: number | null
    extended_count: number | null
    status: string | null
    sort_order: number | null
    created_at: Date | null
    ppt_required: boolean | null
    examples_required: number | null
    tier: string | null
  }

  export type SubtopicsMaxAggregateOutputType = {
    id: string | null
    topic_id: string | null
    ref: string | null
    title: string | null
    due_date: Date | null
    sprint_week: string | null
    qs_total: number | null
    mcq_count: number | null
    short_ans_count: number | null
    structured_count: number | null
    extended_count: number | null
    status: string | null
    sort_order: number | null
    created_at: Date | null
    ppt_required: boolean | null
    examples_required: number | null
    tier: string | null
  }

  export type SubtopicsCountAggregateOutputType = {
    id: number
    topic_id: number
    ref: number
    title: number
    due_date: number
    sprint_week: number
    qs_total: number
    mcq_count: number
    short_ans_count: number
    structured_count: number
    extended_count: number
    status: number
    sort_order: number
    created_at: number
    ppt_required: number
    examples_required: number
    tier: number
    _all: number
  }


  export type SubtopicsAvgAggregateInputType = {
    qs_total?: true
    mcq_count?: true
    short_ans_count?: true
    structured_count?: true
    extended_count?: true
    sort_order?: true
    examples_required?: true
  }

  export type SubtopicsSumAggregateInputType = {
    qs_total?: true
    mcq_count?: true
    short_ans_count?: true
    structured_count?: true
    extended_count?: true
    sort_order?: true
    examples_required?: true
  }

  export type SubtopicsMinAggregateInputType = {
    id?: true
    topic_id?: true
    ref?: true
    title?: true
    due_date?: true
    sprint_week?: true
    qs_total?: true
    mcq_count?: true
    short_ans_count?: true
    structured_count?: true
    extended_count?: true
    status?: true
    sort_order?: true
    created_at?: true
    ppt_required?: true
    examples_required?: true
    tier?: true
  }

  export type SubtopicsMaxAggregateInputType = {
    id?: true
    topic_id?: true
    ref?: true
    title?: true
    due_date?: true
    sprint_week?: true
    qs_total?: true
    mcq_count?: true
    short_ans_count?: true
    structured_count?: true
    extended_count?: true
    status?: true
    sort_order?: true
    created_at?: true
    ppt_required?: true
    examples_required?: true
    tier?: true
  }

  export type SubtopicsCountAggregateInputType = {
    id?: true
    topic_id?: true
    ref?: true
    title?: true
    due_date?: true
    sprint_week?: true
    qs_total?: true
    mcq_count?: true
    short_ans_count?: true
    structured_count?: true
    extended_count?: true
    status?: true
    sort_order?: true
    created_at?: true
    ppt_required?: true
    examples_required?: true
    tier?: true
    _all?: true
  }

  export type SubtopicsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which subtopics to aggregate.
     */
    where?: subtopicsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subtopics to fetch.
     */
    orderBy?: subtopicsOrderByWithRelationInput | subtopicsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: subtopicsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subtopics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subtopics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned subtopics
    **/
    _count?: true | SubtopicsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubtopicsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubtopicsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubtopicsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubtopicsMaxAggregateInputType
  }

  export type GetSubtopicsAggregateType<T extends SubtopicsAggregateArgs> = {
        [P in keyof T & keyof AggregateSubtopics]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubtopics[P]>
      : GetScalarType<T[P], AggregateSubtopics[P]>
  }




  export type subtopicsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: subtopicsWhereInput
    orderBy?: subtopicsOrderByWithAggregationInput | subtopicsOrderByWithAggregationInput[]
    by: SubtopicsScalarFieldEnum[] | SubtopicsScalarFieldEnum
    having?: subtopicsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubtopicsCountAggregateInputType | true
    _avg?: SubtopicsAvgAggregateInputType
    _sum?: SubtopicsSumAggregateInputType
    _min?: SubtopicsMinAggregateInputType
    _max?: SubtopicsMaxAggregateInputType
  }

  export type SubtopicsGroupByOutputType = {
    id: string
    topic_id: string
    ref: string
    title: string
    due_date: Date | null
    sprint_week: string | null
    qs_total: number
    mcq_count: number
    short_ans_count: number
    structured_count: number
    extended_count: number
    status: string
    sort_order: number
    created_at: Date | null
    ppt_required: boolean
    examples_required: number
    tier: string
    _count: SubtopicsCountAggregateOutputType | null
    _avg: SubtopicsAvgAggregateOutputType | null
    _sum: SubtopicsSumAggregateOutputType | null
    _min: SubtopicsMinAggregateOutputType | null
    _max: SubtopicsMaxAggregateOutputType | null
  }

  type GetSubtopicsGroupByPayload<T extends subtopicsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubtopicsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubtopicsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubtopicsGroupByOutputType[P]>
            : GetScalarType<T[P], SubtopicsGroupByOutputType[P]>
        }
      >
    >


  export type subtopicsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    topic_id?: boolean
    ref?: boolean
    title?: boolean
    due_date?: boolean
    sprint_week?: boolean
    qs_total?: boolean
    mcq_count?: boolean
    short_ans_count?: boolean
    structured_count?: boolean
    extended_count?: boolean
    status?: boolean
    sort_order?: boolean
    created_at?: boolean
    ppt_required?: boolean
    examples_required?: boolean
    tier?: boolean
  }, ExtArgs["result"]["subtopics"]>

  export type subtopicsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    topic_id?: boolean
    ref?: boolean
    title?: boolean
    due_date?: boolean
    sprint_week?: boolean
    qs_total?: boolean
    mcq_count?: boolean
    short_ans_count?: boolean
    structured_count?: boolean
    extended_count?: boolean
    status?: boolean
    sort_order?: boolean
    created_at?: boolean
    ppt_required?: boolean
    examples_required?: boolean
    tier?: boolean
  }, ExtArgs["result"]["subtopics"]>

  export type subtopicsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    topic_id?: boolean
    ref?: boolean
    title?: boolean
    due_date?: boolean
    sprint_week?: boolean
    qs_total?: boolean
    mcq_count?: boolean
    short_ans_count?: boolean
    structured_count?: boolean
    extended_count?: boolean
    status?: boolean
    sort_order?: boolean
    created_at?: boolean
    ppt_required?: boolean
    examples_required?: boolean
    tier?: boolean
  }, ExtArgs["result"]["subtopics"]>

  export type subtopicsSelectScalar = {
    id?: boolean
    topic_id?: boolean
    ref?: boolean
    title?: boolean
    due_date?: boolean
    sprint_week?: boolean
    qs_total?: boolean
    mcq_count?: boolean
    short_ans_count?: boolean
    structured_count?: boolean
    extended_count?: boolean
    status?: boolean
    sort_order?: boolean
    created_at?: boolean
    ppt_required?: boolean
    examples_required?: boolean
    tier?: boolean
  }

  export type subtopicsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "topic_id" | "ref" | "title" | "due_date" | "sprint_week" | "qs_total" | "mcq_count" | "short_ans_count" | "structured_count" | "extended_count" | "status" | "sort_order" | "created_at" | "ppt_required" | "examples_required" | "tier", ExtArgs["result"]["subtopics"]>

  export type $subtopicsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "subtopics"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      topic_id: string
      ref: string
      title: string
      due_date: Date | null
      sprint_week: string | null
      qs_total: number
      mcq_count: number
      short_ans_count: number
      structured_count: number
      extended_count: number
      status: string
      sort_order: number
      created_at: Date | null
      ppt_required: boolean
      examples_required: number
      tier: string
    }, ExtArgs["result"]["subtopics"]>
    composites: {}
  }

  type subtopicsGetPayload<S extends boolean | null | undefined | subtopicsDefaultArgs> = $Result.GetResult<Prisma.$subtopicsPayload, S>

  type subtopicsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<subtopicsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubtopicsCountAggregateInputType | true
    }

  export interface subtopicsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['subtopics'], meta: { name: 'subtopics' } }
    /**
     * Find zero or one Subtopics that matches the filter.
     * @param {subtopicsFindUniqueArgs} args - Arguments to find a Subtopics
     * @example
     * // Get one Subtopics
     * const subtopics = await prisma.subtopics.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends subtopicsFindUniqueArgs>(args: SelectSubset<T, subtopicsFindUniqueArgs<ExtArgs>>): Prisma__subtopicsClient<$Result.GetResult<Prisma.$subtopicsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Subtopics that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {subtopicsFindUniqueOrThrowArgs} args - Arguments to find a Subtopics
     * @example
     * // Get one Subtopics
     * const subtopics = await prisma.subtopics.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends subtopicsFindUniqueOrThrowArgs>(args: SelectSubset<T, subtopicsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__subtopicsClient<$Result.GetResult<Prisma.$subtopicsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subtopics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subtopicsFindFirstArgs} args - Arguments to find a Subtopics
     * @example
     * // Get one Subtopics
     * const subtopics = await prisma.subtopics.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends subtopicsFindFirstArgs>(args?: SelectSubset<T, subtopicsFindFirstArgs<ExtArgs>>): Prisma__subtopicsClient<$Result.GetResult<Prisma.$subtopicsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subtopics that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subtopicsFindFirstOrThrowArgs} args - Arguments to find a Subtopics
     * @example
     * // Get one Subtopics
     * const subtopics = await prisma.subtopics.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends subtopicsFindFirstOrThrowArgs>(args?: SelectSubset<T, subtopicsFindFirstOrThrowArgs<ExtArgs>>): Prisma__subtopicsClient<$Result.GetResult<Prisma.$subtopicsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Subtopics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subtopicsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subtopics
     * const subtopics = await prisma.subtopics.findMany()
     * 
     * // Get first 10 Subtopics
     * const subtopics = await prisma.subtopics.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subtopicsWithIdOnly = await prisma.subtopics.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends subtopicsFindManyArgs>(args?: SelectSubset<T, subtopicsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$subtopicsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Subtopics.
     * @param {subtopicsCreateArgs} args - Arguments to create a Subtopics.
     * @example
     * // Create one Subtopics
     * const Subtopics = await prisma.subtopics.create({
     *   data: {
     *     // ... data to create a Subtopics
     *   }
     * })
     * 
     */
    create<T extends subtopicsCreateArgs>(args: SelectSubset<T, subtopicsCreateArgs<ExtArgs>>): Prisma__subtopicsClient<$Result.GetResult<Prisma.$subtopicsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Subtopics.
     * @param {subtopicsCreateManyArgs} args - Arguments to create many Subtopics.
     * @example
     * // Create many Subtopics
     * const subtopics = await prisma.subtopics.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends subtopicsCreateManyArgs>(args?: SelectSubset<T, subtopicsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Subtopics and returns the data saved in the database.
     * @param {subtopicsCreateManyAndReturnArgs} args - Arguments to create many Subtopics.
     * @example
     * // Create many Subtopics
     * const subtopics = await prisma.subtopics.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Subtopics and only return the `id`
     * const subtopicsWithIdOnly = await prisma.subtopics.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends subtopicsCreateManyAndReturnArgs>(args?: SelectSubset<T, subtopicsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$subtopicsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Subtopics.
     * @param {subtopicsDeleteArgs} args - Arguments to delete one Subtopics.
     * @example
     * // Delete one Subtopics
     * const Subtopics = await prisma.subtopics.delete({
     *   where: {
     *     // ... filter to delete one Subtopics
     *   }
     * })
     * 
     */
    delete<T extends subtopicsDeleteArgs>(args: SelectSubset<T, subtopicsDeleteArgs<ExtArgs>>): Prisma__subtopicsClient<$Result.GetResult<Prisma.$subtopicsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Subtopics.
     * @param {subtopicsUpdateArgs} args - Arguments to update one Subtopics.
     * @example
     * // Update one Subtopics
     * const subtopics = await prisma.subtopics.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends subtopicsUpdateArgs>(args: SelectSubset<T, subtopicsUpdateArgs<ExtArgs>>): Prisma__subtopicsClient<$Result.GetResult<Prisma.$subtopicsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Subtopics.
     * @param {subtopicsDeleteManyArgs} args - Arguments to filter Subtopics to delete.
     * @example
     * // Delete a few Subtopics
     * const { count } = await prisma.subtopics.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends subtopicsDeleteManyArgs>(args?: SelectSubset<T, subtopicsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subtopics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subtopicsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subtopics
     * const subtopics = await prisma.subtopics.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends subtopicsUpdateManyArgs>(args: SelectSubset<T, subtopicsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subtopics and returns the data updated in the database.
     * @param {subtopicsUpdateManyAndReturnArgs} args - Arguments to update many Subtopics.
     * @example
     * // Update many Subtopics
     * const subtopics = await prisma.subtopics.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Subtopics and only return the `id`
     * const subtopicsWithIdOnly = await prisma.subtopics.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends subtopicsUpdateManyAndReturnArgs>(args: SelectSubset<T, subtopicsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$subtopicsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Subtopics.
     * @param {subtopicsUpsertArgs} args - Arguments to update or create a Subtopics.
     * @example
     * // Update or create a Subtopics
     * const subtopics = await prisma.subtopics.upsert({
     *   create: {
     *     // ... data to create a Subtopics
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subtopics we want to update
     *   }
     * })
     */
    upsert<T extends subtopicsUpsertArgs>(args: SelectSubset<T, subtopicsUpsertArgs<ExtArgs>>): Prisma__subtopicsClient<$Result.GetResult<Prisma.$subtopicsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Subtopics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subtopicsCountArgs} args - Arguments to filter Subtopics to count.
     * @example
     * // Count the number of Subtopics
     * const count = await prisma.subtopics.count({
     *   where: {
     *     // ... the filter for the Subtopics we want to count
     *   }
     * })
    **/
    count<T extends subtopicsCountArgs>(
      args?: Subset<T, subtopicsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubtopicsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subtopics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubtopicsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubtopicsAggregateArgs>(args: Subset<T, SubtopicsAggregateArgs>): Prisma.PrismaPromise<GetSubtopicsAggregateType<T>>

    /**
     * Group by Subtopics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subtopicsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends subtopicsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: subtopicsGroupByArgs['orderBy'] }
        : { orderBy?: subtopicsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, subtopicsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubtopicsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the subtopics model
   */
  readonly fields: subtopicsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for subtopics.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__subtopicsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the subtopics model
   */
  interface subtopicsFieldRefs {
    readonly id: FieldRef<"subtopics", 'String'>
    readonly topic_id: FieldRef<"subtopics", 'String'>
    readonly ref: FieldRef<"subtopics", 'String'>
    readonly title: FieldRef<"subtopics", 'String'>
    readonly due_date: FieldRef<"subtopics", 'DateTime'>
    readonly sprint_week: FieldRef<"subtopics", 'String'>
    readonly qs_total: FieldRef<"subtopics", 'Int'>
    readonly mcq_count: FieldRef<"subtopics", 'Int'>
    readonly short_ans_count: FieldRef<"subtopics", 'Int'>
    readonly structured_count: FieldRef<"subtopics", 'Int'>
    readonly extended_count: FieldRef<"subtopics", 'Int'>
    readonly status: FieldRef<"subtopics", 'String'>
    readonly sort_order: FieldRef<"subtopics", 'Int'>
    readonly created_at: FieldRef<"subtopics", 'DateTime'>
    readonly ppt_required: FieldRef<"subtopics", 'Boolean'>
    readonly examples_required: FieldRef<"subtopics", 'Int'>
    readonly tier: FieldRef<"subtopics", 'String'>
  }
    

  // Custom InputTypes
  /**
   * subtopics findUnique
   */
  export type subtopicsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subtopics
     */
    select?: subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subtopics
     */
    omit?: subtopicsOmit<ExtArgs> | null
    /**
     * Filter, which subtopics to fetch.
     */
    where: subtopicsWhereUniqueInput
  }

  /**
   * subtopics findUniqueOrThrow
   */
  export type subtopicsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subtopics
     */
    select?: subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subtopics
     */
    omit?: subtopicsOmit<ExtArgs> | null
    /**
     * Filter, which subtopics to fetch.
     */
    where: subtopicsWhereUniqueInput
  }

  /**
   * subtopics findFirst
   */
  export type subtopicsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subtopics
     */
    select?: subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subtopics
     */
    omit?: subtopicsOmit<ExtArgs> | null
    /**
     * Filter, which subtopics to fetch.
     */
    where?: subtopicsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subtopics to fetch.
     */
    orderBy?: subtopicsOrderByWithRelationInput | subtopicsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for subtopics.
     */
    cursor?: subtopicsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subtopics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subtopics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of subtopics.
     */
    distinct?: SubtopicsScalarFieldEnum | SubtopicsScalarFieldEnum[]
  }

  /**
   * subtopics findFirstOrThrow
   */
  export type subtopicsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subtopics
     */
    select?: subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subtopics
     */
    omit?: subtopicsOmit<ExtArgs> | null
    /**
     * Filter, which subtopics to fetch.
     */
    where?: subtopicsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subtopics to fetch.
     */
    orderBy?: subtopicsOrderByWithRelationInput | subtopicsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for subtopics.
     */
    cursor?: subtopicsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subtopics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subtopics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of subtopics.
     */
    distinct?: SubtopicsScalarFieldEnum | SubtopicsScalarFieldEnum[]
  }

  /**
   * subtopics findMany
   */
  export type subtopicsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subtopics
     */
    select?: subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subtopics
     */
    omit?: subtopicsOmit<ExtArgs> | null
    /**
     * Filter, which subtopics to fetch.
     */
    where?: subtopicsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subtopics to fetch.
     */
    orderBy?: subtopicsOrderByWithRelationInput | subtopicsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing subtopics.
     */
    cursor?: subtopicsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subtopics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subtopics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of subtopics.
     */
    distinct?: SubtopicsScalarFieldEnum | SubtopicsScalarFieldEnum[]
  }

  /**
   * subtopics create
   */
  export type subtopicsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subtopics
     */
    select?: subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subtopics
     */
    omit?: subtopicsOmit<ExtArgs> | null
    /**
     * The data needed to create a subtopics.
     */
    data: XOR<subtopicsCreateInput, subtopicsUncheckedCreateInput>
  }

  /**
   * subtopics createMany
   */
  export type subtopicsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many subtopics.
     */
    data: subtopicsCreateManyInput | subtopicsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * subtopics createManyAndReturn
   */
  export type subtopicsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subtopics
     */
    select?: subtopicsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the subtopics
     */
    omit?: subtopicsOmit<ExtArgs> | null
    /**
     * The data used to create many subtopics.
     */
    data: subtopicsCreateManyInput | subtopicsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * subtopics update
   */
  export type subtopicsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subtopics
     */
    select?: subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subtopics
     */
    omit?: subtopicsOmit<ExtArgs> | null
    /**
     * The data needed to update a subtopics.
     */
    data: XOR<subtopicsUpdateInput, subtopicsUncheckedUpdateInput>
    /**
     * Choose, which subtopics to update.
     */
    where: subtopicsWhereUniqueInput
  }

  /**
   * subtopics updateMany
   */
  export type subtopicsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update subtopics.
     */
    data: XOR<subtopicsUpdateManyMutationInput, subtopicsUncheckedUpdateManyInput>
    /**
     * Filter which subtopics to update
     */
    where?: subtopicsWhereInput
    /**
     * Limit how many subtopics to update.
     */
    limit?: number
  }

  /**
   * subtopics updateManyAndReturn
   */
  export type subtopicsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subtopics
     */
    select?: subtopicsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the subtopics
     */
    omit?: subtopicsOmit<ExtArgs> | null
    /**
     * The data used to update subtopics.
     */
    data: XOR<subtopicsUpdateManyMutationInput, subtopicsUncheckedUpdateManyInput>
    /**
     * Filter which subtopics to update
     */
    where?: subtopicsWhereInput
    /**
     * Limit how many subtopics to update.
     */
    limit?: number
  }

  /**
   * subtopics upsert
   */
  export type subtopicsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subtopics
     */
    select?: subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subtopics
     */
    omit?: subtopicsOmit<ExtArgs> | null
    /**
     * The filter to search for the subtopics to update in case it exists.
     */
    where: subtopicsWhereUniqueInput
    /**
     * In case the subtopics found by the `where` argument doesn't exist, create a new subtopics with this data.
     */
    create: XOR<subtopicsCreateInput, subtopicsUncheckedCreateInput>
    /**
     * In case the subtopics was found with the provided `where` argument, update it with this data.
     */
    update: XOR<subtopicsUpdateInput, subtopicsUncheckedUpdateInput>
  }

  /**
   * subtopics delete
   */
  export type subtopicsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subtopics
     */
    select?: subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subtopics
     */
    omit?: subtopicsOmit<ExtArgs> | null
    /**
     * Filter which subtopics to delete.
     */
    where: subtopicsWhereUniqueInput
  }

  /**
   * subtopics deleteMany
   */
  export type subtopicsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which subtopics to delete
     */
    where?: subtopicsWhereInput
    /**
     * Limit how many subtopics to delete.
     */
    limit?: number
  }

  /**
   * subtopics without action
   */
  export type subtopicsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subtopics
     */
    select?: subtopicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subtopics
     */
    omit?: subtopicsOmit<ExtArgs> | null
  }


  /**
   * Model topics
   */

  export type AggregateTopics = {
    _count: TopicsCountAggregateOutputType | null
    _avg: TopicsAvgAggregateOutputType | null
    _sum: TopicsSumAggregateOutputType | null
    _min: TopicsMinAggregateOutputType | null
    _max: TopicsMaxAggregateOutputType | null
  }

  export type TopicsAvgAggregateOutputType = {
    subtopic_count: number | null
    total_questions: number | null
    ppt_decks: number | null
    hours_est: number | null
    sort_order: number | null
  }

  export type TopicsSumAggregateOutputType = {
    subtopic_count: number | null
    total_questions: number | null
    ppt_decks: number | null
    hours_est: number | null
    sort_order: number | null
  }

  export type TopicsMinAggregateOutputType = {
    id: string | null
    ref: string | null
    name: string | null
    subtopic_count: number | null
    total_questions: number | null
    ppt_decks: number | null
    completion_date: Date | null
    hours_est: number | null
    sort_order: number | null
    created_at: Date | null
    subject_id: string | null
  }

  export type TopicsMaxAggregateOutputType = {
    id: string | null
    ref: string | null
    name: string | null
    subtopic_count: number | null
    total_questions: number | null
    ppt_decks: number | null
    completion_date: Date | null
    hours_est: number | null
    sort_order: number | null
    created_at: Date | null
    subject_id: string | null
  }

  export type TopicsCountAggregateOutputType = {
    id: number
    ref: number
    name: number
    subtopic_count: number
    total_questions: number
    ppt_decks: number
    completion_date: number
    hours_est: number
    sort_order: number
    created_at: number
    subject_id: number
    _all: number
  }


  export type TopicsAvgAggregateInputType = {
    subtopic_count?: true
    total_questions?: true
    ppt_decks?: true
    hours_est?: true
    sort_order?: true
  }

  export type TopicsSumAggregateInputType = {
    subtopic_count?: true
    total_questions?: true
    ppt_decks?: true
    hours_est?: true
    sort_order?: true
  }

  export type TopicsMinAggregateInputType = {
    id?: true
    ref?: true
    name?: true
    subtopic_count?: true
    total_questions?: true
    ppt_decks?: true
    completion_date?: true
    hours_est?: true
    sort_order?: true
    created_at?: true
    subject_id?: true
  }

  export type TopicsMaxAggregateInputType = {
    id?: true
    ref?: true
    name?: true
    subtopic_count?: true
    total_questions?: true
    ppt_decks?: true
    completion_date?: true
    hours_est?: true
    sort_order?: true
    created_at?: true
    subject_id?: true
  }

  export type TopicsCountAggregateInputType = {
    id?: true
    ref?: true
    name?: true
    subtopic_count?: true
    total_questions?: true
    ppt_decks?: true
    completion_date?: true
    hours_est?: true
    sort_order?: true
    created_at?: true
    subject_id?: true
    _all?: true
  }

  export type TopicsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which topics to aggregate.
     */
    where?: topicsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of topics to fetch.
     */
    orderBy?: topicsOrderByWithRelationInput | topicsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: topicsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` topics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned topics
    **/
    _count?: true | TopicsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TopicsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TopicsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TopicsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TopicsMaxAggregateInputType
  }

  export type GetTopicsAggregateType<T extends TopicsAggregateArgs> = {
        [P in keyof T & keyof AggregateTopics]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTopics[P]>
      : GetScalarType<T[P], AggregateTopics[P]>
  }




  export type topicsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: topicsWhereInput
    orderBy?: topicsOrderByWithAggregationInput | topicsOrderByWithAggregationInput[]
    by: TopicsScalarFieldEnum[] | TopicsScalarFieldEnum
    having?: topicsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TopicsCountAggregateInputType | true
    _avg?: TopicsAvgAggregateInputType
    _sum?: TopicsSumAggregateInputType
    _min?: TopicsMinAggregateInputType
    _max?: TopicsMaxAggregateInputType
  }

  export type TopicsGroupByOutputType = {
    id: string
    ref: string
    name: string
    subtopic_count: number
    total_questions: number
    ppt_decks: number
    completion_date: Date | null
    hours_est: number | null
    sort_order: number
    created_at: Date | null
    subject_id: string | null
    _count: TopicsCountAggregateOutputType | null
    _avg: TopicsAvgAggregateOutputType | null
    _sum: TopicsSumAggregateOutputType | null
    _min: TopicsMinAggregateOutputType | null
    _max: TopicsMaxAggregateOutputType | null
  }

  type GetTopicsGroupByPayload<T extends topicsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TopicsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TopicsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TopicsGroupByOutputType[P]>
            : GetScalarType<T[P], TopicsGroupByOutputType[P]>
        }
      >
    >


  export type topicsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ref?: boolean
    name?: boolean
    subtopic_count?: boolean
    total_questions?: boolean
    ppt_decks?: boolean
    completion_date?: boolean
    hours_est?: boolean
    sort_order?: boolean
    created_at?: boolean
    subject_id?: boolean
  }, ExtArgs["result"]["topics"]>

  export type topicsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ref?: boolean
    name?: boolean
    subtopic_count?: boolean
    total_questions?: boolean
    ppt_decks?: boolean
    completion_date?: boolean
    hours_est?: boolean
    sort_order?: boolean
    created_at?: boolean
    subject_id?: boolean
  }, ExtArgs["result"]["topics"]>

  export type topicsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ref?: boolean
    name?: boolean
    subtopic_count?: boolean
    total_questions?: boolean
    ppt_decks?: boolean
    completion_date?: boolean
    hours_est?: boolean
    sort_order?: boolean
    created_at?: boolean
    subject_id?: boolean
  }, ExtArgs["result"]["topics"]>

  export type topicsSelectScalar = {
    id?: boolean
    ref?: boolean
    name?: boolean
    subtopic_count?: boolean
    total_questions?: boolean
    ppt_decks?: boolean
    completion_date?: boolean
    hours_est?: boolean
    sort_order?: boolean
    created_at?: boolean
    subject_id?: boolean
  }

  export type topicsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ref" | "name" | "subtopic_count" | "total_questions" | "ppt_decks" | "completion_date" | "hours_est" | "sort_order" | "created_at" | "subject_id", ExtArgs["result"]["topics"]>

  export type $topicsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "topics"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ref: string
      name: string
      subtopic_count: number
      total_questions: number
      ppt_decks: number
      completion_date: Date | null
      hours_est: number | null
      sort_order: number
      created_at: Date | null
      subject_id: string | null
    }, ExtArgs["result"]["topics"]>
    composites: {}
  }

  type topicsGetPayload<S extends boolean | null | undefined | topicsDefaultArgs> = $Result.GetResult<Prisma.$topicsPayload, S>

  type topicsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<topicsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TopicsCountAggregateInputType | true
    }

  export interface topicsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['topics'], meta: { name: 'topics' } }
    /**
     * Find zero or one Topics that matches the filter.
     * @param {topicsFindUniqueArgs} args - Arguments to find a Topics
     * @example
     * // Get one Topics
     * const topics = await prisma.topics.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends topicsFindUniqueArgs>(args: SelectSubset<T, topicsFindUniqueArgs<ExtArgs>>): Prisma__topicsClient<$Result.GetResult<Prisma.$topicsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Topics that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {topicsFindUniqueOrThrowArgs} args - Arguments to find a Topics
     * @example
     * // Get one Topics
     * const topics = await prisma.topics.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends topicsFindUniqueOrThrowArgs>(args: SelectSubset<T, topicsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__topicsClient<$Result.GetResult<Prisma.$topicsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Topics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {topicsFindFirstArgs} args - Arguments to find a Topics
     * @example
     * // Get one Topics
     * const topics = await prisma.topics.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends topicsFindFirstArgs>(args?: SelectSubset<T, topicsFindFirstArgs<ExtArgs>>): Prisma__topicsClient<$Result.GetResult<Prisma.$topicsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Topics that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {topicsFindFirstOrThrowArgs} args - Arguments to find a Topics
     * @example
     * // Get one Topics
     * const topics = await prisma.topics.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends topicsFindFirstOrThrowArgs>(args?: SelectSubset<T, topicsFindFirstOrThrowArgs<ExtArgs>>): Prisma__topicsClient<$Result.GetResult<Prisma.$topicsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Topics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {topicsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Topics
     * const topics = await prisma.topics.findMany()
     * 
     * // Get first 10 Topics
     * const topics = await prisma.topics.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const topicsWithIdOnly = await prisma.topics.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends topicsFindManyArgs>(args?: SelectSubset<T, topicsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$topicsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Topics.
     * @param {topicsCreateArgs} args - Arguments to create a Topics.
     * @example
     * // Create one Topics
     * const Topics = await prisma.topics.create({
     *   data: {
     *     // ... data to create a Topics
     *   }
     * })
     * 
     */
    create<T extends topicsCreateArgs>(args: SelectSubset<T, topicsCreateArgs<ExtArgs>>): Prisma__topicsClient<$Result.GetResult<Prisma.$topicsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Topics.
     * @param {topicsCreateManyArgs} args - Arguments to create many Topics.
     * @example
     * // Create many Topics
     * const topics = await prisma.topics.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends topicsCreateManyArgs>(args?: SelectSubset<T, topicsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Topics and returns the data saved in the database.
     * @param {topicsCreateManyAndReturnArgs} args - Arguments to create many Topics.
     * @example
     * // Create many Topics
     * const topics = await prisma.topics.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Topics and only return the `id`
     * const topicsWithIdOnly = await prisma.topics.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends topicsCreateManyAndReturnArgs>(args?: SelectSubset<T, topicsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$topicsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Topics.
     * @param {topicsDeleteArgs} args - Arguments to delete one Topics.
     * @example
     * // Delete one Topics
     * const Topics = await prisma.topics.delete({
     *   where: {
     *     // ... filter to delete one Topics
     *   }
     * })
     * 
     */
    delete<T extends topicsDeleteArgs>(args: SelectSubset<T, topicsDeleteArgs<ExtArgs>>): Prisma__topicsClient<$Result.GetResult<Prisma.$topicsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Topics.
     * @param {topicsUpdateArgs} args - Arguments to update one Topics.
     * @example
     * // Update one Topics
     * const topics = await prisma.topics.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends topicsUpdateArgs>(args: SelectSubset<T, topicsUpdateArgs<ExtArgs>>): Prisma__topicsClient<$Result.GetResult<Prisma.$topicsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Topics.
     * @param {topicsDeleteManyArgs} args - Arguments to filter Topics to delete.
     * @example
     * // Delete a few Topics
     * const { count } = await prisma.topics.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends topicsDeleteManyArgs>(args?: SelectSubset<T, topicsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Topics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {topicsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Topics
     * const topics = await prisma.topics.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends topicsUpdateManyArgs>(args: SelectSubset<T, topicsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Topics and returns the data updated in the database.
     * @param {topicsUpdateManyAndReturnArgs} args - Arguments to update many Topics.
     * @example
     * // Update many Topics
     * const topics = await prisma.topics.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Topics and only return the `id`
     * const topicsWithIdOnly = await prisma.topics.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends topicsUpdateManyAndReturnArgs>(args: SelectSubset<T, topicsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$topicsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Topics.
     * @param {topicsUpsertArgs} args - Arguments to update or create a Topics.
     * @example
     * // Update or create a Topics
     * const topics = await prisma.topics.upsert({
     *   create: {
     *     // ... data to create a Topics
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Topics we want to update
     *   }
     * })
     */
    upsert<T extends topicsUpsertArgs>(args: SelectSubset<T, topicsUpsertArgs<ExtArgs>>): Prisma__topicsClient<$Result.GetResult<Prisma.$topicsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Topics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {topicsCountArgs} args - Arguments to filter Topics to count.
     * @example
     * // Count the number of Topics
     * const count = await prisma.topics.count({
     *   where: {
     *     // ... the filter for the Topics we want to count
     *   }
     * })
    **/
    count<T extends topicsCountArgs>(
      args?: Subset<T, topicsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TopicsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Topics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TopicsAggregateArgs>(args: Subset<T, TopicsAggregateArgs>): Prisma.PrismaPromise<GetTopicsAggregateType<T>>

    /**
     * Group by Topics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {topicsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends topicsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: topicsGroupByArgs['orderBy'] }
        : { orderBy?: topicsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, topicsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTopicsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the topics model
   */
  readonly fields: topicsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for topics.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__topicsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the topics model
   */
  interface topicsFieldRefs {
    readonly id: FieldRef<"topics", 'String'>
    readonly ref: FieldRef<"topics", 'String'>
    readonly name: FieldRef<"topics", 'String'>
    readonly subtopic_count: FieldRef<"topics", 'Int'>
    readonly total_questions: FieldRef<"topics", 'Int'>
    readonly ppt_decks: FieldRef<"topics", 'Int'>
    readonly completion_date: FieldRef<"topics", 'DateTime'>
    readonly hours_est: FieldRef<"topics", 'Int'>
    readonly sort_order: FieldRef<"topics", 'Int'>
    readonly created_at: FieldRef<"topics", 'DateTime'>
    readonly subject_id: FieldRef<"topics", 'String'>
  }
    

  // Custom InputTypes
  /**
   * topics findUnique
   */
  export type topicsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the topics
     */
    select?: topicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the topics
     */
    omit?: topicsOmit<ExtArgs> | null
    /**
     * Filter, which topics to fetch.
     */
    where: topicsWhereUniqueInput
  }

  /**
   * topics findUniqueOrThrow
   */
  export type topicsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the topics
     */
    select?: topicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the topics
     */
    omit?: topicsOmit<ExtArgs> | null
    /**
     * Filter, which topics to fetch.
     */
    where: topicsWhereUniqueInput
  }

  /**
   * topics findFirst
   */
  export type topicsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the topics
     */
    select?: topicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the topics
     */
    omit?: topicsOmit<ExtArgs> | null
    /**
     * Filter, which topics to fetch.
     */
    where?: topicsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of topics to fetch.
     */
    orderBy?: topicsOrderByWithRelationInput | topicsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for topics.
     */
    cursor?: topicsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` topics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of topics.
     */
    distinct?: TopicsScalarFieldEnum | TopicsScalarFieldEnum[]
  }

  /**
   * topics findFirstOrThrow
   */
  export type topicsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the topics
     */
    select?: topicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the topics
     */
    omit?: topicsOmit<ExtArgs> | null
    /**
     * Filter, which topics to fetch.
     */
    where?: topicsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of topics to fetch.
     */
    orderBy?: topicsOrderByWithRelationInput | topicsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for topics.
     */
    cursor?: topicsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` topics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of topics.
     */
    distinct?: TopicsScalarFieldEnum | TopicsScalarFieldEnum[]
  }

  /**
   * topics findMany
   */
  export type topicsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the topics
     */
    select?: topicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the topics
     */
    omit?: topicsOmit<ExtArgs> | null
    /**
     * Filter, which topics to fetch.
     */
    where?: topicsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of topics to fetch.
     */
    orderBy?: topicsOrderByWithRelationInput | topicsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing topics.
     */
    cursor?: topicsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` topics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of topics.
     */
    distinct?: TopicsScalarFieldEnum | TopicsScalarFieldEnum[]
  }

  /**
   * topics create
   */
  export type topicsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the topics
     */
    select?: topicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the topics
     */
    omit?: topicsOmit<ExtArgs> | null
    /**
     * The data needed to create a topics.
     */
    data: XOR<topicsCreateInput, topicsUncheckedCreateInput>
  }

  /**
   * topics createMany
   */
  export type topicsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many topics.
     */
    data: topicsCreateManyInput | topicsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * topics createManyAndReturn
   */
  export type topicsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the topics
     */
    select?: topicsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the topics
     */
    omit?: topicsOmit<ExtArgs> | null
    /**
     * The data used to create many topics.
     */
    data: topicsCreateManyInput | topicsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * topics update
   */
  export type topicsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the topics
     */
    select?: topicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the topics
     */
    omit?: topicsOmit<ExtArgs> | null
    /**
     * The data needed to update a topics.
     */
    data: XOR<topicsUpdateInput, topicsUncheckedUpdateInput>
    /**
     * Choose, which topics to update.
     */
    where: topicsWhereUniqueInput
  }

  /**
   * topics updateMany
   */
  export type topicsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update topics.
     */
    data: XOR<topicsUpdateManyMutationInput, topicsUncheckedUpdateManyInput>
    /**
     * Filter which topics to update
     */
    where?: topicsWhereInput
    /**
     * Limit how many topics to update.
     */
    limit?: number
  }

  /**
   * topics updateManyAndReturn
   */
  export type topicsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the topics
     */
    select?: topicsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the topics
     */
    omit?: topicsOmit<ExtArgs> | null
    /**
     * The data used to update topics.
     */
    data: XOR<topicsUpdateManyMutationInput, topicsUncheckedUpdateManyInput>
    /**
     * Filter which topics to update
     */
    where?: topicsWhereInput
    /**
     * Limit how many topics to update.
     */
    limit?: number
  }

  /**
   * topics upsert
   */
  export type topicsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the topics
     */
    select?: topicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the topics
     */
    omit?: topicsOmit<ExtArgs> | null
    /**
     * The filter to search for the topics to update in case it exists.
     */
    where: topicsWhereUniqueInput
    /**
     * In case the topics found by the `where` argument doesn't exist, create a new topics with this data.
     */
    create: XOR<topicsCreateInput, topicsUncheckedCreateInput>
    /**
     * In case the topics was found with the provided `where` argument, update it with this data.
     */
    update: XOR<topicsUpdateInput, topicsUncheckedUpdateInput>
  }

  /**
   * topics delete
   */
  export type topicsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the topics
     */
    select?: topicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the topics
     */
    omit?: topicsOmit<ExtArgs> | null
    /**
     * Filter which topics to delete.
     */
    where: topicsWhereUniqueInput
  }

  /**
   * topics deleteMany
   */
  export type topicsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which topics to delete
     */
    where?: topicsWhereInput
    /**
     * Limit how many topics to delete.
     */
    limit?: number
  }

  /**
   * topics without action
   */
  export type topicsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the topics
     */
    select?: topicsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the topics
     */
    omit?: topicsOmit<ExtArgs> | null
  }


  /**
   * Model upload_batches
   */

  export type AggregateUpload_batches = {
    _count: Upload_batchesCountAggregateOutputType | null
    _avg: Upload_batchesAvgAggregateOutputType | null
    _sum: Upload_batchesSumAggregateOutputType | null
    _min: Upload_batchesMinAggregateOutputType | null
    _max: Upload_batchesMaxAggregateOutputType | null
  }

  export type Upload_batchesAvgAggregateOutputType = {
    total_files: number | null
    completed_files: number | null
    failed_files: number | null
    total_questions_extracted: number | null
    total_questions: number | null
    questions_extracted: number | null
  }

  export type Upload_batchesSumAggregateOutputType = {
    total_files: number | null
    completed_files: number | null
    failed_files: number | null
    total_questions_extracted: number | null
    total_questions: number | null
    questions_extracted: number | null
  }

  export type Upload_batchesMinAggregateOutputType = {
    id: string | null
    created_by: string | null
    total_files: number | null
    completed_files: number | null
    failed_files: number | null
    total_questions_extracted: number | null
    topic_id: string | null
    subtopic_id: string | null
    sub_subtopic_id: string | null
    status: string | null
    created_at: Date | null
    completed_at: Date | null
    source_pdf_path: string | null
    source_file_name: string | null
    storage_path: string | null
    total_questions: number | null
    questions_extracted: number | null
    error_message: string | null
  }

  export type Upload_batchesMaxAggregateOutputType = {
    id: string | null
    created_by: string | null
    total_files: number | null
    completed_files: number | null
    failed_files: number | null
    total_questions_extracted: number | null
    topic_id: string | null
    subtopic_id: string | null
    sub_subtopic_id: string | null
    status: string | null
    created_at: Date | null
    completed_at: Date | null
    source_pdf_path: string | null
    source_file_name: string | null
    storage_path: string | null
    total_questions: number | null
    questions_extracted: number | null
    error_message: string | null
  }

  export type Upload_batchesCountAggregateOutputType = {
    id: number
    created_by: number
    total_files: number
    completed_files: number
    failed_files: number
    total_questions_extracted: number
    topic_id: number
    subtopic_id: number
    sub_subtopic_id: number
    status: number
    created_at: number
    completed_at: number
    source_pdf_path: number
    source_file_name: number
    storage_path: number
    total_questions: number
    questions_extracted: number
    error_message: number
    _all: number
  }


  export type Upload_batchesAvgAggregateInputType = {
    total_files?: true
    completed_files?: true
    failed_files?: true
    total_questions_extracted?: true
    total_questions?: true
    questions_extracted?: true
  }

  export type Upload_batchesSumAggregateInputType = {
    total_files?: true
    completed_files?: true
    failed_files?: true
    total_questions_extracted?: true
    total_questions?: true
    questions_extracted?: true
  }

  export type Upload_batchesMinAggregateInputType = {
    id?: true
    created_by?: true
    total_files?: true
    completed_files?: true
    failed_files?: true
    total_questions_extracted?: true
    topic_id?: true
    subtopic_id?: true
    sub_subtopic_id?: true
    status?: true
    created_at?: true
    completed_at?: true
    source_pdf_path?: true
    source_file_name?: true
    storage_path?: true
    total_questions?: true
    questions_extracted?: true
    error_message?: true
  }

  export type Upload_batchesMaxAggregateInputType = {
    id?: true
    created_by?: true
    total_files?: true
    completed_files?: true
    failed_files?: true
    total_questions_extracted?: true
    topic_id?: true
    subtopic_id?: true
    sub_subtopic_id?: true
    status?: true
    created_at?: true
    completed_at?: true
    source_pdf_path?: true
    source_file_name?: true
    storage_path?: true
    total_questions?: true
    questions_extracted?: true
    error_message?: true
  }

  export type Upload_batchesCountAggregateInputType = {
    id?: true
    created_by?: true
    total_files?: true
    completed_files?: true
    failed_files?: true
    total_questions_extracted?: true
    topic_id?: true
    subtopic_id?: true
    sub_subtopic_id?: true
    status?: true
    created_at?: true
    completed_at?: true
    source_pdf_path?: true
    source_file_name?: true
    storage_path?: true
    total_questions?: true
    questions_extracted?: true
    error_message?: true
    _all?: true
  }

  export type Upload_batchesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which upload_batches to aggregate.
     */
    where?: upload_batchesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of upload_batches to fetch.
     */
    orderBy?: upload_batchesOrderByWithRelationInput | upload_batchesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: upload_batchesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` upload_batches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` upload_batches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned upload_batches
    **/
    _count?: true | Upload_batchesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Upload_batchesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Upload_batchesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Upload_batchesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Upload_batchesMaxAggregateInputType
  }

  export type GetUpload_batchesAggregateType<T extends Upload_batchesAggregateArgs> = {
        [P in keyof T & keyof AggregateUpload_batches]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUpload_batches[P]>
      : GetScalarType<T[P], AggregateUpload_batches[P]>
  }




  export type upload_batchesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: upload_batchesWhereInput
    orderBy?: upload_batchesOrderByWithAggregationInput | upload_batchesOrderByWithAggregationInput[]
    by: Upload_batchesScalarFieldEnum[] | Upload_batchesScalarFieldEnum
    having?: upload_batchesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Upload_batchesCountAggregateInputType | true
    _avg?: Upload_batchesAvgAggregateInputType
    _sum?: Upload_batchesSumAggregateInputType
    _min?: Upload_batchesMinAggregateInputType
    _max?: Upload_batchesMaxAggregateInputType
  }

  export type Upload_batchesGroupByOutputType = {
    id: string
    created_by: string | null
    total_files: number
    completed_files: number
    failed_files: number
    total_questions_extracted: number
    topic_id: string | null
    subtopic_id: string | null
    sub_subtopic_id: string | null
    status: string
    created_at: Date | null
    completed_at: Date | null
    source_pdf_path: string | null
    source_file_name: string | null
    storage_path: string | null
    total_questions: number | null
    questions_extracted: number | null
    error_message: string | null
    _count: Upload_batchesCountAggregateOutputType | null
    _avg: Upload_batchesAvgAggregateOutputType | null
    _sum: Upload_batchesSumAggregateOutputType | null
    _min: Upload_batchesMinAggregateOutputType | null
    _max: Upload_batchesMaxAggregateOutputType | null
  }

  type GetUpload_batchesGroupByPayload<T extends upload_batchesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Upload_batchesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Upload_batchesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Upload_batchesGroupByOutputType[P]>
            : GetScalarType<T[P], Upload_batchesGroupByOutputType[P]>
        }
      >
    >


  export type upload_batchesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    created_by?: boolean
    total_files?: boolean
    completed_files?: boolean
    failed_files?: boolean
    total_questions_extracted?: boolean
    topic_id?: boolean
    subtopic_id?: boolean
    sub_subtopic_id?: boolean
    status?: boolean
    created_at?: boolean
    completed_at?: boolean
    source_pdf_path?: boolean
    source_file_name?: boolean
    storage_path?: boolean
    total_questions?: boolean
    questions_extracted?: boolean
    error_message?: boolean
  }, ExtArgs["result"]["upload_batches"]>

  export type upload_batchesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    created_by?: boolean
    total_files?: boolean
    completed_files?: boolean
    failed_files?: boolean
    total_questions_extracted?: boolean
    topic_id?: boolean
    subtopic_id?: boolean
    sub_subtopic_id?: boolean
    status?: boolean
    created_at?: boolean
    completed_at?: boolean
    source_pdf_path?: boolean
    source_file_name?: boolean
    storage_path?: boolean
    total_questions?: boolean
    questions_extracted?: boolean
    error_message?: boolean
  }, ExtArgs["result"]["upload_batches"]>

  export type upload_batchesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    created_by?: boolean
    total_files?: boolean
    completed_files?: boolean
    failed_files?: boolean
    total_questions_extracted?: boolean
    topic_id?: boolean
    subtopic_id?: boolean
    sub_subtopic_id?: boolean
    status?: boolean
    created_at?: boolean
    completed_at?: boolean
    source_pdf_path?: boolean
    source_file_name?: boolean
    storage_path?: boolean
    total_questions?: boolean
    questions_extracted?: boolean
    error_message?: boolean
  }, ExtArgs["result"]["upload_batches"]>

  export type upload_batchesSelectScalar = {
    id?: boolean
    created_by?: boolean
    total_files?: boolean
    completed_files?: boolean
    failed_files?: boolean
    total_questions_extracted?: boolean
    topic_id?: boolean
    subtopic_id?: boolean
    sub_subtopic_id?: boolean
    status?: boolean
    created_at?: boolean
    completed_at?: boolean
    source_pdf_path?: boolean
    source_file_name?: boolean
    storage_path?: boolean
    total_questions?: boolean
    questions_extracted?: boolean
    error_message?: boolean
  }

  export type upload_batchesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "created_by" | "total_files" | "completed_files" | "failed_files" | "total_questions_extracted" | "topic_id" | "subtopic_id" | "sub_subtopic_id" | "status" | "created_at" | "completed_at" | "source_pdf_path" | "source_file_name" | "storage_path" | "total_questions" | "questions_extracted" | "error_message", ExtArgs["result"]["upload_batches"]>

  export type $upload_batchesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "upload_batches"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      created_by: string | null
      total_files: number
      completed_files: number
      failed_files: number
      total_questions_extracted: number
      topic_id: string | null
      subtopic_id: string | null
      sub_subtopic_id: string | null
      status: string
      created_at: Date | null
      completed_at: Date | null
      source_pdf_path: string | null
      source_file_name: string | null
      storage_path: string | null
      total_questions: number | null
      questions_extracted: number | null
      error_message: string | null
    }, ExtArgs["result"]["upload_batches"]>
    composites: {}
  }

  type upload_batchesGetPayload<S extends boolean | null | undefined | upload_batchesDefaultArgs> = $Result.GetResult<Prisma.$upload_batchesPayload, S>

  type upload_batchesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<upload_batchesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Upload_batchesCountAggregateInputType | true
    }

  export interface upload_batchesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['upload_batches'], meta: { name: 'upload_batches' } }
    /**
     * Find zero or one Upload_batches that matches the filter.
     * @param {upload_batchesFindUniqueArgs} args - Arguments to find a Upload_batches
     * @example
     * // Get one Upload_batches
     * const upload_batches = await prisma.upload_batches.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends upload_batchesFindUniqueArgs>(args: SelectSubset<T, upload_batchesFindUniqueArgs<ExtArgs>>): Prisma__upload_batchesClient<$Result.GetResult<Prisma.$upload_batchesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Upload_batches that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {upload_batchesFindUniqueOrThrowArgs} args - Arguments to find a Upload_batches
     * @example
     * // Get one Upload_batches
     * const upload_batches = await prisma.upload_batches.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends upload_batchesFindUniqueOrThrowArgs>(args: SelectSubset<T, upload_batchesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__upload_batchesClient<$Result.GetResult<Prisma.$upload_batchesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Upload_batches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {upload_batchesFindFirstArgs} args - Arguments to find a Upload_batches
     * @example
     * // Get one Upload_batches
     * const upload_batches = await prisma.upload_batches.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends upload_batchesFindFirstArgs>(args?: SelectSubset<T, upload_batchesFindFirstArgs<ExtArgs>>): Prisma__upload_batchesClient<$Result.GetResult<Prisma.$upload_batchesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Upload_batches that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {upload_batchesFindFirstOrThrowArgs} args - Arguments to find a Upload_batches
     * @example
     * // Get one Upload_batches
     * const upload_batches = await prisma.upload_batches.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends upload_batchesFindFirstOrThrowArgs>(args?: SelectSubset<T, upload_batchesFindFirstOrThrowArgs<ExtArgs>>): Prisma__upload_batchesClient<$Result.GetResult<Prisma.$upload_batchesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Upload_batches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {upload_batchesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Upload_batches
     * const upload_batches = await prisma.upload_batches.findMany()
     * 
     * // Get first 10 Upload_batches
     * const upload_batches = await prisma.upload_batches.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const upload_batchesWithIdOnly = await prisma.upload_batches.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends upload_batchesFindManyArgs>(args?: SelectSubset<T, upload_batchesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$upload_batchesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Upload_batches.
     * @param {upload_batchesCreateArgs} args - Arguments to create a Upload_batches.
     * @example
     * // Create one Upload_batches
     * const Upload_batches = await prisma.upload_batches.create({
     *   data: {
     *     // ... data to create a Upload_batches
     *   }
     * })
     * 
     */
    create<T extends upload_batchesCreateArgs>(args: SelectSubset<T, upload_batchesCreateArgs<ExtArgs>>): Prisma__upload_batchesClient<$Result.GetResult<Prisma.$upload_batchesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Upload_batches.
     * @param {upload_batchesCreateManyArgs} args - Arguments to create many Upload_batches.
     * @example
     * // Create many Upload_batches
     * const upload_batches = await prisma.upload_batches.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends upload_batchesCreateManyArgs>(args?: SelectSubset<T, upload_batchesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Upload_batches and returns the data saved in the database.
     * @param {upload_batchesCreateManyAndReturnArgs} args - Arguments to create many Upload_batches.
     * @example
     * // Create many Upload_batches
     * const upload_batches = await prisma.upload_batches.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Upload_batches and only return the `id`
     * const upload_batchesWithIdOnly = await prisma.upload_batches.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends upload_batchesCreateManyAndReturnArgs>(args?: SelectSubset<T, upload_batchesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$upload_batchesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Upload_batches.
     * @param {upload_batchesDeleteArgs} args - Arguments to delete one Upload_batches.
     * @example
     * // Delete one Upload_batches
     * const Upload_batches = await prisma.upload_batches.delete({
     *   where: {
     *     // ... filter to delete one Upload_batches
     *   }
     * })
     * 
     */
    delete<T extends upload_batchesDeleteArgs>(args: SelectSubset<T, upload_batchesDeleteArgs<ExtArgs>>): Prisma__upload_batchesClient<$Result.GetResult<Prisma.$upload_batchesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Upload_batches.
     * @param {upload_batchesUpdateArgs} args - Arguments to update one Upload_batches.
     * @example
     * // Update one Upload_batches
     * const upload_batches = await prisma.upload_batches.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends upload_batchesUpdateArgs>(args: SelectSubset<T, upload_batchesUpdateArgs<ExtArgs>>): Prisma__upload_batchesClient<$Result.GetResult<Prisma.$upload_batchesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Upload_batches.
     * @param {upload_batchesDeleteManyArgs} args - Arguments to filter Upload_batches to delete.
     * @example
     * // Delete a few Upload_batches
     * const { count } = await prisma.upload_batches.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends upload_batchesDeleteManyArgs>(args?: SelectSubset<T, upload_batchesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Upload_batches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {upload_batchesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Upload_batches
     * const upload_batches = await prisma.upload_batches.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends upload_batchesUpdateManyArgs>(args: SelectSubset<T, upload_batchesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Upload_batches and returns the data updated in the database.
     * @param {upload_batchesUpdateManyAndReturnArgs} args - Arguments to update many Upload_batches.
     * @example
     * // Update many Upload_batches
     * const upload_batches = await prisma.upload_batches.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Upload_batches and only return the `id`
     * const upload_batchesWithIdOnly = await prisma.upload_batches.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends upload_batchesUpdateManyAndReturnArgs>(args: SelectSubset<T, upload_batchesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$upload_batchesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Upload_batches.
     * @param {upload_batchesUpsertArgs} args - Arguments to update or create a Upload_batches.
     * @example
     * // Update or create a Upload_batches
     * const upload_batches = await prisma.upload_batches.upsert({
     *   create: {
     *     // ... data to create a Upload_batches
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Upload_batches we want to update
     *   }
     * })
     */
    upsert<T extends upload_batchesUpsertArgs>(args: SelectSubset<T, upload_batchesUpsertArgs<ExtArgs>>): Prisma__upload_batchesClient<$Result.GetResult<Prisma.$upload_batchesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Upload_batches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {upload_batchesCountArgs} args - Arguments to filter Upload_batches to count.
     * @example
     * // Count the number of Upload_batches
     * const count = await prisma.upload_batches.count({
     *   where: {
     *     // ... the filter for the Upload_batches we want to count
     *   }
     * })
    **/
    count<T extends upload_batchesCountArgs>(
      args?: Subset<T, upload_batchesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Upload_batchesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Upload_batches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Upload_batchesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Upload_batchesAggregateArgs>(args: Subset<T, Upload_batchesAggregateArgs>): Prisma.PrismaPromise<GetUpload_batchesAggregateType<T>>

    /**
     * Group by Upload_batches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {upload_batchesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends upload_batchesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: upload_batchesGroupByArgs['orderBy'] }
        : { orderBy?: upload_batchesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, upload_batchesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUpload_batchesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the upload_batches model
   */
  readonly fields: upload_batchesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for upload_batches.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__upload_batchesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the upload_batches model
   */
  interface upload_batchesFieldRefs {
    readonly id: FieldRef<"upload_batches", 'String'>
    readonly created_by: FieldRef<"upload_batches", 'String'>
    readonly total_files: FieldRef<"upload_batches", 'Int'>
    readonly completed_files: FieldRef<"upload_batches", 'Int'>
    readonly failed_files: FieldRef<"upload_batches", 'Int'>
    readonly total_questions_extracted: FieldRef<"upload_batches", 'Int'>
    readonly topic_id: FieldRef<"upload_batches", 'String'>
    readonly subtopic_id: FieldRef<"upload_batches", 'String'>
    readonly sub_subtopic_id: FieldRef<"upload_batches", 'String'>
    readonly status: FieldRef<"upload_batches", 'String'>
    readonly created_at: FieldRef<"upload_batches", 'DateTime'>
    readonly completed_at: FieldRef<"upload_batches", 'DateTime'>
    readonly source_pdf_path: FieldRef<"upload_batches", 'String'>
    readonly source_file_name: FieldRef<"upload_batches", 'String'>
    readonly storage_path: FieldRef<"upload_batches", 'String'>
    readonly total_questions: FieldRef<"upload_batches", 'Int'>
    readonly questions_extracted: FieldRef<"upload_batches", 'Int'>
    readonly error_message: FieldRef<"upload_batches", 'String'>
  }
    

  // Custom InputTypes
  /**
   * upload_batches findUnique
   */
  export type upload_batchesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the upload_batches
     */
    select?: upload_batchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the upload_batches
     */
    omit?: upload_batchesOmit<ExtArgs> | null
    /**
     * Filter, which upload_batches to fetch.
     */
    where: upload_batchesWhereUniqueInput
  }

  /**
   * upload_batches findUniqueOrThrow
   */
  export type upload_batchesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the upload_batches
     */
    select?: upload_batchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the upload_batches
     */
    omit?: upload_batchesOmit<ExtArgs> | null
    /**
     * Filter, which upload_batches to fetch.
     */
    where: upload_batchesWhereUniqueInput
  }

  /**
   * upload_batches findFirst
   */
  export type upload_batchesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the upload_batches
     */
    select?: upload_batchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the upload_batches
     */
    omit?: upload_batchesOmit<ExtArgs> | null
    /**
     * Filter, which upload_batches to fetch.
     */
    where?: upload_batchesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of upload_batches to fetch.
     */
    orderBy?: upload_batchesOrderByWithRelationInput | upload_batchesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for upload_batches.
     */
    cursor?: upload_batchesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` upload_batches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` upload_batches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of upload_batches.
     */
    distinct?: Upload_batchesScalarFieldEnum | Upload_batchesScalarFieldEnum[]
  }

  /**
   * upload_batches findFirstOrThrow
   */
  export type upload_batchesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the upload_batches
     */
    select?: upload_batchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the upload_batches
     */
    omit?: upload_batchesOmit<ExtArgs> | null
    /**
     * Filter, which upload_batches to fetch.
     */
    where?: upload_batchesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of upload_batches to fetch.
     */
    orderBy?: upload_batchesOrderByWithRelationInput | upload_batchesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for upload_batches.
     */
    cursor?: upload_batchesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` upload_batches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` upload_batches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of upload_batches.
     */
    distinct?: Upload_batchesScalarFieldEnum | Upload_batchesScalarFieldEnum[]
  }

  /**
   * upload_batches findMany
   */
  export type upload_batchesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the upload_batches
     */
    select?: upload_batchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the upload_batches
     */
    omit?: upload_batchesOmit<ExtArgs> | null
    /**
     * Filter, which upload_batches to fetch.
     */
    where?: upload_batchesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of upload_batches to fetch.
     */
    orderBy?: upload_batchesOrderByWithRelationInput | upload_batchesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing upload_batches.
     */
    cursor?: upload_batchesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` upload_batches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` upload_batches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of upload_batches.
     */
    distinct?: Upload_batchesScalarFieldEnum | Upload_batchesScalarFieldEnum[]
  }

  /**
   * upload_batches create
   */
  export type upload_batchesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the upload_batches
     */
    select?: upload_batchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the upload_batches
     */
    omit?: upload_batchesOmit<ExtArgs> | null
    /**
     * The data needed to create a upload_batches.
     */
    data: XOR<upload_batchesCreateInput, upload_batchesUncheckedCreateInput>
  }

  /**
   * upload_batches createMany
   */
  export type upload_batchesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many upload_batches.
     */
    data: upload_batchesCreateManyInput | upload_batchesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * upload_batches createManyAndReturn
   */
  export type upload_batchesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the upload_batches
     */
    select?: upload_batchesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the upload_batches
     */
    omit?: upload_batchesOmit<ExtArgs> | null
    /**
     * The data used to create many upload_batches.
     */
    data: upload_batchesCreateManyInput | upload_batchesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * upload_batches update
   */
  export type upload_batchesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the upload_batches
     */
    select?: upload_batchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the upload_batches
     */
    omit?: upload_batchesOmit<ExtArgs> | null
    /**
     * The data needed to update a upload_batches.
     */
    data: XOR<upload_batchesUpdateInput, upload_batchesUncheckedUpdateInput>
    /**
     * Choose, which upload_batches to update.
     */
    where: upload_batchesWhereUniqueInput
  }

  /**
   * upload_batches updateMany
   */
  export type upload_batchesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update upload_batches.
     */
    data: XOR<upload_batchesUpdateManyMutationInput, upload_batchesUncheckedUpdateManyInput>
    /**
     * Filter which upload_batches to update
     */
    where?: upload_batchesWhereInput
    /**
     * Limit how many upload_batches to update.
     */
    limit?: number
  }

  /**
   * upload_batches updateManyAndReturn
   */
  export type upload_batchesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the upload_batches
     */
    select?: upload_batchesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the upload_batches
     */
    omit?: upload_batchesOmit<ExtArgs> | null
    /**
     * The data used to update upload_batches.
     */
    data: XOR<upload_batchesUpdateManyMutationInput, upload_batchesUncheckedUpdateManyInput>
    /**
     * Filter which upload_batches to update
     */
    where?: upload_batchesWhereInput
    /**
     * Limit how many upload_batches to update.
     */
    limit?: number
  }

  /**
   * upload_batches upsert
   */
  export type upload_batchesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the upload_batches
     */
    select?: upload_batchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the upload_batches
     */
    omit?: upload_batchesOmit<ExtArgs> | null
    /**
     * The filter to search for the upload_batches to update in case it exists.
     */
    where: upload_batchesWhereUniqueInput
    /**
     * In case the upload_batches found by the `where` argument doesn't exist, create a new upload_batches with this data.
     */
    create: XOR<upload_batchesCreateInput, upload_batchesUncheckedCreateInput>
    /**
     * In case the upload_batches was found with the provided `where` argument, update it with this data.
     */
    update: XOR<upload_batchesUpdateInput, upload_batchesUncheckedUpdateInput>
  }

  /**
   * upload_batches delete
   */
  export type upload_batchesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the upload_batches
     */
    select?: upload_batchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the upload_batches
     */
    omit?: upload_batchesOmit<ExtArgs> | null
    /**
     * Filter which upload_batches to delete.
     */
    where: upload_batchesWhereUniqueInput
  }

  /**
   * upload_batches deleteMany
   */
  export type upload_batchesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which upload_batches to delete
     */
    where?: upload_batchesWhereInput
    /**
     * Limit how many upload_batches to delete.
     */
    limit?: number
  }

  /**
   * upload_batches without action
   */
  export type upload_batchesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the upload_batches
     */
    select?: upload_batchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the upload_batches
     */
    omit?: upload_batchesOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AnswersScalarFieldEnum: {
    id: 'id',
    question_id: 'question_id',
    content_text: 'content_text',
    status: 'status',
    created_by: 'created_by',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type AnswersScalarFieldEnum = (typeof AnswersScalarFieldEnum)[keyof typeof AnswersScalarFieldEnum]


  export const Databank_chunksScalarFieldEnum: {
    id: 'id',
    document_id: 'document_id',
    content: 'content',
    page_number: 'page_number',
    chunk_index: 'chunk_index',
    token_count: 'token_count',
    created_at: 'created_at'
  };

  export type Databank_chunksScalarFieldEnum = (typeof Databank_chunksScalarFieldEnum)[keyof typeof Databank_chunksScalarFieldEnum]


  export const Databank_documentsScalarFieldEnum: {
    id: 'id',
    title: 'title',
    doc_type: 'doc_type',
    topic_id: 'topic_id',
    file_path: 'file_path',
    file_name: 'file_name',
    file_size: 'file_size',
    page_count: 'page_count',
    chunk_count: 'chunk_count',
    processing_status: 'processing_status',
    processing_error: 'processing_error',
    created_at: 'created_at',
    updated_at: 'updated_at',
    subject_id: 'subject_id'
  };

  export type Databank_documentsScalarFieldEnum = (typeof Databank_documentsScalarFieldEnum)[keyof typeof Databank_documentsScalarFieldEnum]


  export const Exam_boardsScalarFieldEnum: {
    id: 'id',
    name: 'name',
    created_at: 'created_at'
  };

  export type Exam_boardsScalarFieldEnum = (typeof Exam_boardsScalarFieldEnum)[keyof typeof Exam_boardsScalarFieldEnum]


  export const Ppt_decksScalarFieldEnum: {
    id: 'id',
    title: 'title',
    subtopic_id: 'subtopic_id',
    status: 'status',
    slides: 'slides',
    created_by: 'created_by',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Ppt_decksScalarFieldEnum = (typeof Ppt_decksScalarFieldEnum)[keyof typeof Ppt_decksScalarFieldEnum]


  export const Production_targetsScalarFieldEnum: {
    id: 'id',
    total_target: 'total_target',
    start_date: 'start_date',
    end_date: 'end_date',
    created_at: 'created_at',
    updated_at: 'updated_at',
    subject_id: 'subject_id'
  };

  export type Production_targetsScalarFieldEnum = (typeof Production_targetsScalarFieldEnum)[keyof typeof Production_targetsScalarFieldEnum]


  export const ProfilesScalarFieldEnum: {
    id: 'id',
    email: 'email',
    role: 'role',
    full_name: 'full_name',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ProfilesScalarFieldEnum = (typeof ProfilesScalarFieldEnum)[keyof typeof ProfilesScalarFieldEnum]


  export const Question_imagesScalarFieldEnum: {
    id: 'id',
    question_id: 'question_id',
    storage_path: 'storage_path',
    public_url: 'public_url',
    image_type: 'image_type',
    caption: 'caption',
    sort_order: 'sort_order',
    uploaded_by: 'uploaded_by',
    created_at: 'created_at',
    display_url: 'display_url'
  };

  export type Question_imagesScalarFieldEnum = (typeof Question_imagesScalarFieldEnum)[keyof typeof Question_imagesScalarFieldEnum]


  export const QuestionsScalarFieldEnum: {
    id: 'id',
    content_text: 'content_text',
    difficulty: 'difficulty',
    marks: 'marks',
    topic_id: 'topic_id',
    subtopic_id: 'subtopic_id',
    sub_subtopic_id: 'sub_subtopic_id',
    exam_board_id: 'exam_board_id',
    status: 'status',
    batch_id: 'batch_id',
    created_by: 'created_by',
    has_image: 'has_image',
    question_number: 'question_number',
    source_page: 'source_page',
    year: 'year',
    paper: 'paper',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type QuestionsScalarFieldEnum = (typeof QuestionsScalarFieldEnum)[keyof typeof QuestionsScalarFieldEnum]


  export const Sub_subtopicsScalarFieldEnum: {
    id: 'id',
    subtopic_id: 'subtopic_id',
    ext_num: 'ext_num',
    core_num: 'core_num',
    outcome: 'outcome',
    tier: 'tier',
    notes: 'notes',
    sort_order: 'sort_order',
    created_at: 'created_at'
  };

  export type Sub_subtopicsScalarFieldEnum = (typeof Sub_subtopicsScalarFieldEnum)[keyof typeof Sub_subtopicsScalarFieldEnum]


  export const SubtopicsScalarFieldEnum: {
    id: 'id',
    topic_id: 'topic_id',
    ref: 'ref',
    title: 'title',
    due_date: 'due_date',
    sprint_week: 'sprint_week',
    qs_total: 'qs_total',
    mcq_count: 'mcq_count',
    short_ans_count: 'short_ans_count',
    structured_count: 'structured_count',
    extended_count: 'extended_count',
    status: 'status',
    sort_order: 'sort_order',
    created_at: 'created_at',
    ppt_required: 'ppt_required',
    examples_required: 'examples_required',
    tier: 'tier'
  };

  export type SubtopicsScalarFieldEnum = (typeof SubtopicsScalarFieldEnum)[keyof typeof SubtopicsScalarFieldEnum]


  export const TopicsScalarFieldEnum: {
    id: 'id',
    ref: 'ref',
    name: 'name',
    subtopic_count: 'subtopic_count',
    total_questions: 'total_questions',
    ppt_decks: 'ppt_decks',
    completion_date: 'completion_date',
    hours_est: 'hours_est',
    sort_order: 'sort_order',
    created_at: 'created_at',
    subject_id: 'subject_id'
  };

  export type TopicsScalarFieldEnum = (typeof TopicsScalarFieldEnum)[keyof typeof TopicsScalarFieldEnum]


  export const Upload_batchesScalarFieldEnum: {
    id: 'id',
    created_by: 'created_by',
    total_files: 'total_files',
    completed_files: 'completed_files',
    failed_files: 'failed_files',
    total_questions_extracted: 'total_questions_extracted',
    topic_id: 'topic_id',
    subtopic_id: 'subtopic_id',
    sub_subtopic_id: 'sub_subtopic_id',
    status: 'status',
    created_at: 'created_at',
    completed_at: 'completed_at',
    source_pdf_path: 'source_pdf_path',
    source_file_name: 'source_file_name',
    storage_path: 'storage_path',
    total_questions: 'total_questions',
    questions_extracted: 'questions_extracted',
    error_message: 'error_message'
  };

  export type Upload_batchesScalarFieldEnum = (typeof Upload_batchesScalarFieldEnum)[keyof typeof Upload_batchesScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type answersWhereInput = {
    AND?: answersWhereInput | answersWhereInput[]
    OR?: answersWhereInput[]
    NOT?: answersWhereInput | answersWhereInput[]
    id?: UuidFilter<"answers"> | string
    question_id?: UuidNullableFilter<"answers"> | string | null
    content_text?: StringNullableFilter<"answers"> | string | null
    status?: StringNullableFilter<"answers"> | string | null
    created_by?: UuidNullableFilter<"answers"> | string | null
    created_at?: DateTimeNullableFilter<"answers"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"answers"> | Date | string | null
  }

  export type answersOrderByWithRelationInput = {
    id?: SortOrder
    question_id?: SortOrderInput | SortOrder
    content_text?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    created_by?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
  }

  export type answersWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: answersWhereInput | answersWhereInput[]
    OR?: answersWhereInput[]
    NOT?: answersWhereInput | answersWhereInput[]
    question_id?: UuidNullableFilter<"answers"> | string | null
    content_text?: StringNullableFilter<"answers"> | string | null
    status?: StringNullableFilter<"answers"> | string | null
    created_by?: UuidNullableFilter<"answers"> | string | null
    created_at?: DateTimeNullableFilter<"answers"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"answers"> | Date | string | null
  }, "id">

  export type answersOrderByWithAggregationInput = {
    id?: SortOrder
    question_id?: SortOrderInput | SortOrder
    content_text?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    created_by?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: answersCountOrderByAggregateInput
    _max?: answersMaxOrderByAggregateInput
    _min?: answersMinOrderByAggregateInput
  }

  export type answersScalarWhereWithAggregatesInput = {
    AND?: answersScalarWhereWithAggregatesInput | answersScalarWhereWithAggregatesInput[]
    OR?: answersScalarWhereWithAggregatesInput[]
    NOT?: answersScalarWhereWithAggregatesInput | answersScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"answers"> | string
    question_id?: UuidNullableWithAggregatesFilter<"answers"> | string | null
    content_text?: StringNullableWithAggregatesFilter<"answers"> | string | null
    status?: StringNullableWithAggregatesFilter<"answers"> | string | null
    created_by?: UuidNullableWithAggregatesFilter<"answers"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"answers"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"answers"> | Date | string | null
  }

  export type databank_chunksWhereInput = {
    AND?: databank_chunksWhereInput | databank_chunksWhereInput[]
    OR?: databank_chunksWhereInput[]
    NOT?: databank_chunksWhereInput | databank_chunksWhereInput[]
    id?: UuidFilter<"databank_chunks"> | string
    document_id?: UuidFilter<"databank_chunks"> | string
    content?: StringFilter<"databank_chunks"> | string
    page_number?: IntNullableFilter<"databank_chunks"> | number | null
    chunk_index?: IntFilter<"databank_chunks"> | number
    token_count?: IntNullableFilter<"databank_chunks"> | number | null
    created_at?: DateTimeNullableFilter<"databank_chunks"> | Date | string | null
  }

  export type databank_chunksOrderByWithRelationInput = {
    id?: SortOrder
    document_id?: SortOrder
    content?: SortOrder
    page_number?: SortOrderInput | SortOrder
    chunk_index?: SortOrder
    token_count?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
  }

  export type databank_chunksWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: databank_chunksWhereInput | databank_chunksWhereInput[]
    OR?: databank_chunksWhereInput[]
    NOT?: databank_chunksWhereInput | databank_chunksWhereInput[]
    document_id?: UuidFilter<"databank_chunks"> | string
    content?: StringFilter<"databank_chunks"> | string
    page_number?: IntNullableFilter<"databank_chunks"> | number | null
    chunk_index?: IntFilter<"databank_chunks"> | number
    token_count?: IntNullableFilter<"databank_chunks"> | number | null
    created_at?: DateTimeNullableFilter<"databank_chunks"> | Date | string | null
  }, "id">

  export type databank_chunksOrderByWithAggregationInput = {
    id?: SortOrder
    document_id?: SortOrder
    content?: SortOrder
    page_number?: SortOrderInput | SortOrder
    chunk_index?: SortOrder
    token_count?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: databank_chunksCountOrderByAggregateInput
    _avg?: databank_chunksAvgOrderByAggregateInput
    _max?: databank_chunksMaxOrderByAggregateInput
    _min?: databank_chunksMinOrderByAggregateInput
    _sum?: databank_chunksSumOrderByAggregateInput
  }

  export type databank_chunksScalarWhereWithAggregatesInput = {
    AND?: databank_chunksScalarWhereWithAggregatesInput | databank_chunksScalarWhereWithAggregatesInput[]
    OR?: databank_chunksScalarWhereWithAggregatesInput[]
    NOT?: databank_chunksScalarWhereWithAggregatesInput | databank_chunksScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"databank_chunks"> | string
    document_id?: UuidWithAggregatesFilter<"databank_chunks"> | string
    content?: StringWithAggregatesFilter<"databank_chunks"> | string
    page_number?: IntNullableWithAggregatesFilter<"databank_chunks"> | number | null
    chunk_index?: IntWithAggregatesFilter<"databank_chunks"> | number
    token_count?: IntNullableWithAggregatesFilter<"databank_chunks"> | number | null
    created_at?: DateTimeNullableWithAggregatesFilter<"databank_chunks"> | Date | string | null
  }

  export type databank_documentsWhereInput = {
    AND?: databank_documentsWhereInput | databank_documentsWhereInput[]
    OR?: databank_documentsWhereInput[]
    NOT?: databank_documentsWhereInput | databank_documentsWhereInput[]
    id?: UuidFilter<"databank_documents"> | string
    title?: StringFilter<"databank_documents"> | string
    doc_type?: StringFilter<"databank_documents"> | string
    topic_id?: UuidNullableFilter<"databank_documents"> | string | null
    file_path?: StringFilter<"databank_documents"> | string
    file_name?: StringFilter<"databank_documents"> | string
    file_size?: IntNullableFilter<"databank_documents"> | number | null
    page_count?: IntNullableFilter<"databank_documents"> | number | null
    chunk_count?: IntNullableFilter<"databank_documents"> | number | null
    processing_status?: StringFilter<"databank_documents"> | string
    processing_error?: StringNullableFilter<"databank_documents"> | string | null
    created_at?: DateTimeNullableFilter<"databank_documents"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"databank_documents"> | Date | string | null
    subject_id?: UuidNullableFilter<"databank_documents"> | string | null
  }

  export type databank_documentsOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    doc_type?: SortOrder
    topic_id?: SortOrderInput | SortOrder
    file_path?: SortOrder
    file_name?: SortOrder
    file_size?: SortOrderInput | SortOrder
    page_count?: SortOrderInput | SortOrder
    chunk_count?: SortOrderInput | SortOrder
    processing_status?: SortOrder
    processing_error?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    subject_id?: SortOrderInput | SortOrder
  }

  export type databank_documentsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: databank_documentsWhereInput | databank_documentsWhereInput[]
    OR?: databank_documentsWhereInput[]
    NOT?: databank_documentsWhereInput | databank_documentsWhereInput[]
    title?: StringFilter<"databank_documents"> | string
    doc_type?: StringFilter<"databank_documents"> | string
    topic_id?: UuidNullableFilter<"databank_documents"> | string | null
    file_path?: StringFilter<"databank_documents"> | string
    file_name?: StringFilter<"databank_documents"> | string
    file_size?: IntNullableFilter<"databank_documents"> | number | null
    page_count?: IntNullableFilter<"databank_documents"> | number | null
    chunk_count?: IntNullableFilter<"databank_documents"> | number | null
    processing_status?: StringFilter<"databank_documents"> | string
    processing_error?: StringNullableFilter<"databank_documents"> | string | null
    created_at?: DateTimeNullableFilter<"databank_documents"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"databank_documents"> | Date | string | null
    subject_id?: UuidNullableFilter<"databank_documents"> | string | null
  }, "id">

  export type databank_documentsOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    doc_type?: SortOrder
    topic_id?: SortOrderInput | SortOrder
    file_path?: SortOrder
    file_name?: SortOrder
    file_size?: SortOrderInput | SortOrder
    page_count?: SortOrderInput | SortOrder
    chunk_count?: SortOrderInput | SortOrder
    processing_status?: SortOrder
    processing_error?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    subject_id?: SortOrderInput | SortOrder
    _count?: databank_documentsCountOrderByAggregateInput
    _avg?: databank_documentsAvgOrderByAggregateInput
    _max?: databank_documentsMaxOrderByAggregateInput
    _min?: databank_documentsMinOrderByAggregateInput
    _sum?: databank_documentsSumOrderByAggregateInput
  }

  export type databank_documentsScalarWhereWithAggregatesInput = {
    AND?: databank_documentsScalarWhereWithAggregatesInput | databank_documentsScalarWhereWithAggregatesInput[]
    OR?: databank_documentsScalarWhereWithAggregatesInput[]
    NOT?: databank_documentsScalarWhereWithAggregatesInput | databank_documentsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"databank_documents"> | string
    title?: StringWithAggregatesFilter<"databank_documents"> | string
    doc_type?: StringWithAggregatesFilter<"databank_documents"> | string
    topic_id?: UuidNullableWithAggregatesFilter<"databank_documents"> | string | null
    file_path?: StringWithAggregatesFilter<"databank_documents"> | string
    file_name?: StringWithAggregatesFilter<"databank_documents"> | string
    file_size?: IntNullableWithAggregatesFilter<"databank_documents"> | number | null
    page_count?: IntNullableWithAggregatesFilter<"databank_documents"> | number | null
    chunk_count?: IntNullableWithAggregatesFilter<"databank_documents"> | number | null
    processing_status?: StringWithAggregatesFilter<"databank_documents"> | string
    processing_error?: StringNullableWithAggregatesFilter<"databank_documents"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"databank_documents"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"databank_documents"> | Date | string | null
    subject_id?: UuidNullableWithAggregatesFilter<"databank_documents"> | string | null
  }

  export type exam_boardsWhereInput = {
    AND?: exam_boardsWhereInput | exam_boardsWhereInput[]
    OR?: exam_boardsWhereInput[]
    NOT?: exam_boardsWhereInput | exam_boardsWhereInput[]
    id?: UuidFilter<"exam_boards"> | string
    name?: StringFilter<"exam_boards"> | string
    created_at?: DateTimeFilter<"exam_boards"> | Date | string
  }

  export type exam_boardsOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
  }

  export type exam_boardsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: exam_boardsWhereInput | exam_boardsWhereInput[]
    OR?: exam_boardsWhereInput[]
    NOT?: exam_boardsWhereInput | exam_boardsWhereInput[]
    name?: StringFilter<"exam_boards"> | string
    created_at?: DateTimeFilter<"exam_boards"> | Date | string
  }, "id">

  export type exam_boardsOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    _count?: exam_boardsCountOrderByAggregateInput
    _max?: exam_boardsMaxOrderByAggregateInput
    _min?: exam_boardsMinOrderByAggregateInput
  }

  export type exam_boardsScalarWhereWithAggregatesInput = {
    AND?: exam_boardsScalarWhereWithAggregatesInput | exam_boardsScalarWhereWithAggregatesInput[]
    OR?: exam_boardsScalarWhereWithAggregatesInput[]
    NOT?: exam_boardsScalarWhereWithAggregatesInput | exam_boardsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"exam_boards"> | string
    name?: StringWithAggregatesFilter<"exam_boards"> | string
    created_at?: DateTimeWithAggregatesFilter<"exam_boards"> | Date | string
  }

  export type ppt_decksWhereInput = {
    AND?: ppt_decksWhereInput | ppt_decksWhereInput[]
    OR?: ppt_decksWhereInput[]
    NOT?: ppt_decksWhereInput | ppt_decksWhereInput[]
    id?: UuidFilter<"ppt_decks"> | string
    title?: StringNullableFilter<"ppt_decks"> | string | null
    subtopic_id?: UuidNullableFilter<"ppt_decks"> | string | null
    status?: StringNullableFilter<"ppt_decks"> | string | null
    slides?: JsonNullableFilter<"ppt_decks">
    created_by?: UuidNullableFilter<"ppt_decks"> | string | null
    created_at?: DateTimeNullableFilter<"ppt_decks"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"ppt_decks"> | Date | string | null
  }

  export type ppt_decksOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    subtopic_id?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    slides?: SortOrderInput | SortOrder
    created_by?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
  }

  export type ppt_decksWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ppt_decksWhereInput | ppt_decksWhereInput[]
    OR?: ppt_decksWhereInput[]
    NOT?: ppt_decksWhereInput | ppt_decksWhereInput[]
    title?: StringNullableFilter<"ppt_decks"> | string | null
    subtopic_id?: UuidNullableFilter<"ppt_decks"> | string | null
    status?: StringNullableFilter<"ppt_decks"> | string | null
    slides?: JsonNullableFilter<"ppt_decks">
    created_by?: UuidNullableFilter<"ppt_decks"> | string | null
    created_at?: DateTimeNullableFilter<"ppt_decks"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"ppt_decks"> | Date | string | null
  }, "id">

  export type ppt_decksOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    subtopic_id?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    slides?: SortOrderInput | SortOrder
    created_by?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: ppt_decksCountOrderByAggregateInput
    _max?: ppt_decksMaxOrderByAggregateInput
    _min?: ppt_decksMinOrderByAggregateInput
  }

  export type ppt_decksScalarWhereWithAggregatesInput = {
    AND?: ppt_decksScalarWhereWithAggregatesInput | ppt_decksScalarWhereWithAggregatesInput[]
    OR?: ppt_decksScalarWhereWithAggregatesInput[]
    NOT?: ppt_decksScalarWhereWithAggregatesInput | ppt_decksScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ppt_decks"> | string
    title?: StringNullableWithAggregatesFilter<"ppt_decks"> | string | null
    subtopic_id?: UuidNullableWithAggregatesFilter<"ppt_decks"> | string | null
    status?: StringNullableWithAggregatesFilter<"ppt_decks"> | string | null
    slides?: JsonNullableWithAggregatesFilter<"ppt_decks">
    created_by?: UuidNullableWithAggregatesFilter<"ppt_decks"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"ppt_decks"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"ppt_decks"> | Date | string | null
  }

  export type production_targetsWhereInput = {
    AND?: production_targetsWhereInput | production_targetsWhereInput[]
    OR?: production_targetsWhereInput[]
    NOT?: production_targetsWhereInput | production_targetsWhereInput[]
    id?: UuidFilter<"production_targets"> | string
    total_target?: IntFilter<"production_targets"> | number
    start_date?: DateTimeFilter<"production_targets"> | Date | string
    end_date?: DateTimeFilter<"production_targets"> | Date | string
    created_at?: DateTimeNullableFilter<"production_targets"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"production_targets"> | Date | string | null
    subject_id?: UuidNullableFilter<"production_targets"> | string | null
  }

  export type production_targetsOrderByWithRelationInput = {
    id?: SortOrder
    total_target?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    subject_id?: SortOrderInput | SortOrder
  }

  export type production_targetsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: production_targetsWhereInput | production_targetsWhereInput[]
    OR?: production_targetsWhereInput[]
    NOT?: production_targetsWhereInput | production_targetsWhereInput[]
    total_target?: IntFilter<"production_targets"> | number
    start_date?: DateTimeFilter<"production_targets"> | Date | string
    end_date?: DateTimeFilter<"production_targets"> | Date | string
    created_at?: DateTimeNullableFilter<"production_targets"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"production_targets"> | Date | string | null
    subject_id?: UuidNullableFilter<"production_targets"> | string | null
  }, "id">

  export type production_targetsOrderByWithAggregationInput = {
    id?: SortOrder
    total_target?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    subject_id?: SortOrderInput | SortOrder
    _count?: production_targetsCountOrderByAggregateInput
    _avg?: production_targetsAvgOrderByAggregateInput
    _max?: production_targetsMaxOrderByAggregateInput
    _min?: production_targetsMinOrderByAggregateInput
    _sum?: production_targetsSumOrderByAggregateInput
  }

  export type production_targetsScalarWhereWithAggregatesInput = {
    AND?: production_targetsScalarWhereWithAggregatesInput | production_targetsScalarWhereWithAggregatesInput[]
    OR?: production_targetsScalarWhereWithAggregatesInput[]
    NOT?: production_targetsScalarWhereWithAggregatesInput | production_targetsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"production_targets"> | string
    total_target?: IntWithAggregatesFilter<"production_targets"> | number
    start_date?: DateTimeWithAggregatesFilter<"production_targets"> | Date | string
    end_date?: DateTimeWithAggregatesFilter<"production_targets"> | Date | string
    created_at?: DateTimeNullableWithAggregatesFilter<"production_targets"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"production_targets"> | Date | string | null
    subject_id?: UuidNullableWithAggregatesFilter<"production_targets"> | string | null
  }

  export type profilesWhereInput = {
    AND?: profilesWhereInput | profilesWhereInput[]
    OR?: profilesWhereInput[]
    NOT?: profilesWhereInput | profilesWhereInput[]
    id?: UuidFilter<"profiles"> | string
    email?: StringNullableFilter<"profiles"> | string | null
    role?: StringNullableFilter<"profiles"> | string | null
    full_name?: StringNullableFilter<"profiles"> | string | null
    created_at?: DateTimeNullableFilter<"profiles"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"profiles"> | Date | string | null
  }

  export type profilesOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    full_name?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
  }

  export type profilesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: profilesWhereInput | profilesWhereInput[]
    OR?: profilesWhereInput[]
    NOT?: profilesWhereInput | profilesWhereInput[]
    email?: StringNullableFilter<"profiles"> | string | null
    role?: StringNullableFilter<"profiles"> | string | null
    full_name?: StringNullableFilter<"profiles"> | string | null
    created_at?: DateTimeNullableFilter<"profiles"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"profiles"> | Date | string | null
  }, "id">

  export type profilesOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    full_name?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: profilesCountOrderByAggregateInput
    _max?: profilesMaxOrderByAggregateInput
    _min?: profilesMinOrderByAggregateInput
  }

  export type profilesScalarWhereWithAggregatesInput = {
    AND?: profilesScalarWhereWithAggregatesInput | profilesScalarWhereWithAggregatesInput[]
    OR?: profilesScalarWhereWithAggregatesInput[]
    NOT?: profilesScalarWhereWithAggregatesInput | profilesScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"profiles"> | string
    email?: StringNullableWithAggregatesFilter<"profiles"> | string | null
    role?: StringNullableWithAggregatesFilter<"profiles"> | string | null
    full_name?: StringNullableWithAggregatesFilter<"profiles"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"profiles"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"profiles"> | Date | string | null
  }

  export type question_imagesWhereInput = {
    AND?: question_imagesWhereInput | question_imagesWhereInput[]
    OR?: question_imagesWhereInput[]
    NOT?: question_imagesWhereInput | question_imagesWhereInput[]
    id?: UuidFilter<"question_images"> | string
    question_id?: UuidFilter<"question_images"> | string
    storage_path?: StringFilter<"question_images"> | string
    public_url?: StringNullableFilter<"question_images"> | string | null
    image_type?: StringFilter<"question_images"> | string
    caption?: StringNullableFilter<"question_images"> | string | null
    sort_order?: IntFilter<"question_images"> | number
    uploaded_by?: UuidNullableFilter<"question_images"> | string | null
    created_at?: DateTimeNullableFilter<"question_images"> | Date | string | null
    display_url?: StringNullableFilter<"question_images"> | string | null
  }

  export type question_imagesOrderByWithRelationInput = {
    id?: SortOrder
    question_id?: SortOrder
    storage_path?: SortOrder
    public_url?: SortOrderInput | SortOrder
    image_type?: SortOrder
    caption?: SortOrderInput | SortOrder
    sort_order?: SortOrder
    uploaded_by?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    display_url?: SortOrderInput | SortOrder
  }

  export type question_imagesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: question_imagesWhereInput | question_imagesWhereInput[]
    OR?: question_imagesWhereInput[]
    NOT?: question_imagesWhereInput | question_imagesWhereInput[]
    question_id?: UuidFilter<"question_images"> | string
    storage_path?: StringFilter<"question_images"> | string
    public_url?: StringNullableFilter<"question_images"> | string | null
    image_type?: StringFilter<"question_images"> | string
    caption?: StringNullableFilter<"question_images"> | string | null
    sort_order?: IntFilter<"question_images"> | number
    uploaded_by?: UuidNullableFilter<"question_images"> | string | null
    created_at?: DateTimeNullableFilter<"question_images"> | Date | string | null
    display_url?: StringNullableFilter<"question_images"> | string | null
  }, "id">

  export type question_imagesOrderByWithAggregationInput = {
    id?: SortOrder
    question_id?: SortOrder
    storage_path?: SortOrder
    public_url?: SortOrderInput | SortOrder
    image_type?: SortOrder
    caption?: SortOrderInput | SortOrder
    sort_order?: SortOrder
    uploaded_by?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    display_url?: SortOrderInput | SortOrder
    _count?: question_imagesCountOrderByAggregateInput
    _avg?: question_imagesAvgOrderByAggregateInput
    _max?: question_imagesMaxOrderByAggregateInput
    _min?: question_imagesMinOrderByAggregateInput
    _sum?: question_imagesSumOrderByAggregateInput
  }

  export type question_imagesScalarWhereWithAggregatesInput = {
    AND?: question_imagesScalarWhereWithAggregatesInput | question_imagesScalarWhereWithAggregatesInput[]
    OR?: question_imagesScalarWhereWithAggregatesInput[]
    NOT?: question_imagesScalarWhereWithAggregatesInput | question_imagesScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"question_images"> | string
    question_id?: UuidWithAggregatesFilter<"question_images"> | string
    storage_path?: StringWithAggregatesFilter<"question_images"> | string
    public_url?: StringNullableWithAggregatesFilter<"question_images"> | string | null
    image_type?: StringWithAggregatesFilter<"question_images"> | string
    caption?: StringNullableWithAggregatesFilter<"question_images"> | string | null
    sort_order?: IntWithAggregatesFilter<"question_images"> | number
    uploaded_by?: UuidNullableWithAggregatesFilter<"question_images"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"question_images"> | Date | string | null
    display_url?: StringNullableWithAggregatesFilter<"question_images"> | string | null
  }

  export type questionsWhereInput = {
    AND?: questionsWhereInput | questionsWhereInput[]
    OR?: questionsWhereInput[]
    NOT?: questionsWhereInput | questionsWhereInput[]
    id?: UuidFilter<"questions"> | string
    content_text?: StringNullableFilter<"questions"> | string | null
    difficulty?: StringNullableFilter<"questions"> | string | null
    marks?: IntNullableFilter<"questions"> | number | null
    topic_id?: UuidNullableFilter<"questions"> | string | null
    subtopic_id?: UuidNullableFilter<"questions"> | string | null
    sub_subtopic_id?: UuidNullableFilter<"questions"> | string | null
    exam_board_id?: UuidNullableFilter<"questions"> | string | null
    status?: StringNullableFilter<"questions"> | string | null
    batch_id?: UuidNullableFilter<"questions"> | string | null
    created_by?: UuidNullableFilter<"questions"> | string | null
    has_image?: BoolNullableFilter<"questions"> | boolean | null
    question_number?: IntNullableFilter<"questions"> | number | null
    source_page?: IntNullableFilter<"questions"> | number | null
    year?: IntNullableFilter<"questions"> | number | null
    paper?: StringNullableFilter<"questions"> | string | null
    created_at?: DateTimeNullableFilter<"questions"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"questions"> | Date | string | null
  }

  export type questionsOrderByWithRelationInput = {
    id?: SortOrder
    content_text?: SortOrderInput | SortOrder
    difficulty?: SortOrderInput | SortOrder
    marks?: SortOrderInput | SortOrder
    topic_id?: SortOrderInput | SortOrder
    subtopic_id?: SortOrderInput | SortOrder
    sub_subtopic_id?: SortOrderInput | SortOrder
    exam_board_id?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    batch_id?: SortOrderInput | SortOrder
    created_by?: SortOrderInput | SortOrder
    has_image?: SortOrderInput | SortOrder
    question_number?: SortOrderInput | SortOrder
    source_page?: SortOrderInput | SortOrder
    year?: SortOrderInput | SortOrder
    paper?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
  }

  export type questionsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: questionsWhereInput | questionsWhereInput[]
    OR?: questionsWhereInput[]
    NOT?: questionsWhereInput | questionsWhereInput[]
    content_text?: StringNullableFilter<"questions"> | string | null
    difficulty?: StringNullableFilter<"questions"> | string | null
    marks?: IntNullableFilter<"questions"> | number | null
    topic_id?: UuidNullableFilter<"questions"> | string | null
    subtopic_id?: UuidNullableFilter<"questions"> | string | null
    sub_subtopic_id?: UuidNullableFilter<"questions"> | string | null
    exam_board_id?: UuidNullableFilter<"questions"> | string | null
    status?: StringNullableFilter<"questions"> | string | null
    batch_id?: UuidNullableFilter<"questions"> | string | null
    created_by?: UuidNullableFilter<"questions"> | string | null
    has_image?: BoolNullableFilter<"questions"> | boolean | null
    question_number?: IntNullableFilter<"questions"> | number | null
    source_page?: IntNullableFilter<"questions"> | number | null
    year?: IntNullableFilter<"questions"> | number | null
    paper?: StringNullableFilter<"questions"> | string | null
    created_at?: DateTimeNullableFilter<"questions"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"questions"> | Date | string | null
  }, "id">

  export type questionsOrderByWithAggregationInput = {
    id?: SortOrder
    content_text?: SortOrderInput | SortOrder
    difficulty?: SortOrderInput | SortOrder
    marks?: SortOrderInput | SortOrder
    topic_id?: SortOrderInput | SortOrder
    subtopic_id?: SortOrderInput | SortOrder
    sub_subtopic_id?: SortOrderInput | SortOrder
    exam_board_id?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    batch_id?: SortOrderInput | SortOrder
    created_by?: SortOrderInput | SortOrder
    has_image?: SortOrderInput | SortOrder
    question_number?: SortOrderInput | SortOrder
    source_page?: SortOrderInput | SortOrder
    year?: SortOrderInput | SortOrder
    paper?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: questionsCountOrderByAggregateInput
    _avg?: questionsAvgOrderByAggregateInput
    _max?: questionsMaxOrderByAggregateInput
    _min?: questionsMinOrderByAggregateInput
    _sum?: questionsSumOrderByAggregateInput
  }

  export type questionsScalarWhereWithAggregatesInput = {
    AND?: questionsScalarWhereWithAggregatesInput | questionsScalarWhereWithAggregatesInput[]
    OR?: questionsScalarWhereWithAggregatesInput[]
    NOT?: questionsScalarWhereWithAggregatesInput | questionsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"questions"> | string
    content_text?: StringNullableWithAggregatesFilter<"questions"> | string | null
    difficulty?: StringNullableWithAggregatesFilter<"questions"> | string | null
    marks?: IntNullableWithAggregatesFilter<"questions"> | number | null
    topic_id?: UuidNullableWithAggregatesFilter<"questions"> | string | null
    subtopic_id?: UuidNullableWithAggregatesFilter<"questions"> | string | null
    sub_subtopic_id?: UuidNullableWithAggregatesFilter<"questions"> | string | null
    exam_board_id?: UuidNullableWithAggregatesFilter<"questions"> | string | null
    status?: StringNullableWithAggregatesFilter<"questions"> | string | null
    batch_id?: UuidNullableWithAggregatesFilter<"questions"> | string | null
    created_by?: UuidNullableWithAggregatesFilter<"questions"> | string | null
    has_image?: BoolNullableWithAggregatesFilter<"questions"> | boolean | null
    question_number?: IntNullableWithAggregatesFilter<"questions"> | number | null
    source_page?: IntNullableWithAggregatesFilter<"questions"> | number | null
    year?: IntNullableWithAggregatesFilter<"questions"> | number | null
    paper?: StringNullableWithAggregatesFilter<"questions"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"questions"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"questions"> | Date | string | null
  }

  export type sub_subtopicsWhereInput = {
    AND?: sub_subtopicsWhereInput | sub_subtopicsWhereInput[]
    OR?: sub_subtopicsWhereInput[]
    NOT?: sub_subtopicsWhereInput | sub_subtopicsWhereInput[]
    id?: UuidFilter<"sub_subtopics"> | string
    subtopic_id?: UuidFilter<"sub_subtopics"> | string
    ext_num?: IntFilter<"sub_subtopics"> | number
    core_num?: IntNullableFilter<"sub_subtopics"> | number | null
    outcome?: StringFilter<"sub_subtopics"> | string
    tier?: StringFilter<"sub_subtopics"> | string
    notes?: StringNullableFilter<"sub_subtopics"> | string | null
    sort_order?: IntFilter<"sub_subtopics"> | number
    created_at?: DateTimeNullableFilter<"sub_subtopics"> | Date | string | null
  }

  export type sub_subtopicsOrderByWithRelationInput = {
    id?: SortOrder
    subtopic_id?: SortOrder
    ext_num?: SortOrder
    core_num?: SortOrderInput | SortOrder
    outcome?: SortOrder
    tier?: SortOrder
    notes?: SortOrderInput | SortOrder
    sort_order?: SortOrder
    created_at?: SortOrderInput | SortOrder
  }

  export type sub_subtopicsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: sub_subtopicsWhereInput | sub_subtopicsWhereInput[]
    OR?: sub_subtopicsWhereInput[]
    NOT?: sub_subtopicsWhereInput | sub_subtopicsWhereInput[]
    subtopic_id?: UuidFilter<"sub_subtopics"> | string
    ext_num?: IntFilter<"sub_subtopics"> | number
    core_num?: IntNullableFilter<"sub_subtopics"> | number | null
    outcome?: StringFilter<"sub_subtopics"> | string
    tier?: StringFilter<"sub_subtopics"> | string
    notes?: StringNullableFilter<"sub_subtopics"> | string | null
    sort_order?: IntFilter<"sub_subtopics"> | number
    created_at?: DateTimeNullableFilter<"sub_subtopics"> | Date | string | null
  }, "id">

  export type sub_subtopicsOrderByWithAggregationInput = {
    id?: SortOrder
    subtopic_id?: SortOrder
    ext_num?: SortOrder
    core_num?: SortOrderInput | SortOrder
    outcome?: SortOrder
    tier?: SortOrder
    notes?: SortOrderInput | SortOrder
    sort_order?: SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: sub_subtopicsCountOrderByAggregateInput
    _avg?: sub_subtopicsAvgOrderByAggregateInput
    _max?: sub_subtopicsMaxOrderByAggregateInput
    _min?: sub_subtopicsMinOrderByAggregateInput
    _sum?: sub_subtopicsSumOrderByAggregateInput
  }

  export type sub_subtopicsScalarWhereWithAggregatesInput = {
    AND?: sub_subtopicsScalarWhereWithAggregatesInput | sub_subtopicsScalarWhereWithAggregatesInput[]
    OR?: sub_subtopicsScalarWhereWithAggregatesInput[]
    NOT?: sub_subtopicsScalarWhereWithAggregatesInput | sub_subtopicsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"sub_subtopics"> | string
    subtopic_id?: UuidWithAggregatesFilter<"sub_subtopics"> | string
    ext_num?: IntWithAggregatesFilter<"sub_subtopics"> | number
    core_num?: IntNullableWithAggregatesFilter<"sub_subtopics"> | number | null
    outcome?: StringWithAggregatesFilter<"sub_subtopics"> | string
    tier?: StringWithAggregatesFilter<"sub_subtopics"> | string
    notes?: StringNullableWithAggregatesFilter<"sub_subtopics"> | string | null
    sort_order?: IntWithAggregatesFilter<"sub_subtopics"> | number
    created_at?: DateTimeNullableWithAggregatesFilter<"sub_subtopics"> | Date | string | null
  }

  export type subtopicsWhereInput = {
    AND?: subtopicsWhereInput | subtopicsWhereInput[]
    OR?: subtopicsWhereInput[]
    NOT?: subtopicsWhereInput | subtopicsWhereInput[]
    id?: UuidFilter<"subtopics"> | string
    topic_id?: UuidFilter<"subtopics"> | string
    ref?: StringFilter<"subtopics"> | string
    title?: StringFilter<"subtopics"> | string
    due_date?: DateTimeNullableFilter<"subtopics"> | Date | string | null
    sprint_week?: StringNullableFilter<"subtopics"> | string | null
    qs_total?: IntFilter<"subtopics"> | number
    mcq_count?: IntFilter<"subtopics"> | number
    short_ans_count?: IntFilter<"subtopics"> | number
    structured_count?: IntFilter<"subtopics"> | number
    extended_count?: IntFilter<"subtopics"> | number
    status?: StringFilter<"subtopics"> | string
    sort_order?: IntFilter<"subtopics"> | number
    created_at?: DateTimeNullableFilter<"subtopics"> | Date | string | null
    ppt_required?: BoolFilter<"subtopics"> | boolean
    examples_required?: IntFilter<"subtopics"> | number
    tier?: StringFilter<"subtopics"> | string
  }

  export type subtopicsOrderByWithRelationInput = {
    id?: SortOrder
    topic_id?: SortOrder
    ref?: SortOrder
    title?: SortOrder
    due_date?: SortOrderInput | SortOrder
    sprint_week?: SortOrderInput | SortOrder
    qs_total?: SortOrder
    mcq_count?: SortOrder
    short_ans_count?: SortOrder
    structured_count?: SortOrder
    extended_count?: SortOrder
    status?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrderInput | SortOrder
    ppt_required?: SortOrder
    examples_required?: SortOrder
    tier?: SortOrder
  }

  export type subtopicsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: subtopicsWhereInput | subtopicsWhereInput[]
    OR?: subtopicsWhereInput[]
    NOT?: subtopicsWhereInput | subtopicsWhereInput[]
    topic_id?: UuidFilter<"subtopics"> | string
    ref?: StringFilter<"subtopics"> | string
    title?: StringFilter<"subtopics"> | string
    due_date?: DateTimeNullableFilter<"subtopics"> | Date | string | null
    sprint_week?: StringNullableFilter<"subtopics"> | string | null
    qs_total?: IntFilter<"subtopics"> | number
    mcq_count?: IntFilter<"subtopics"> | number
    short_ans_count?: IntFilter<"subtopics"> | number
    structured_count?: IntFilter<"subtopics"> | number
    extended_count?: IntFilter<"subtopics"> | number
    status?: StringFilter<"subtopics"> | string
    sort_order?: IntFilter<"subtopics"> | number
    created_at?: DateTimeNullableFilter<"subtopics"> | Date | string | null
    ppt_required?: BoolFilter<"subtopics"> | boolean
    examples_required?: IntFilter<"subtopics"> | number
    tier?: StringFilter<"subtopics"> | string
  }, "id">

  export type subtopicsOrderByWithAggregationInput = {
    id?: SortOrder
    topic_id?: SortOrder
    ref?: SortOrder
    title?: SortOrder
    due_date?: SortOrderInput | SortOrder
    sprint_week?: SortOrderInput | SortOrder
    qs_total?: SortOrder
    mcq_count?: SortOrder
    short_ans_count?: SortOrder
    structured_count?: SortOrder
    extended_count?: SortOrder
    status?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrderInput | SortOrder
    ppt_required?: SortOrder
    examples_required?: SortOrder
    tier?: SortOrder
    _count?: subtopicsCountOrderByAggregateInput
    _avg?: subtopicsAvgOrderByAggregateInput
    _max?: subtopicsMaxOrderByAggregateInput
    _min?: subtopicsMinOrderByAggregateInput
    _sum?: subtopicsSumOrderByAggregateInput
  }

  export type subtopicsScalarWhereWithAggregatesInput = {
    AND?: subtopicsScalarWhereWithAggregatesInput | subtopicsScalarWhereWithAggregatesInput[]
    OR?: subtopicsScalarWhereWithAggregatesInput[]
    NOT?: subtopicsScalarWhereWithAggregatesInput | subtopicsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"subtopics"> | string
    topic_id?: UuidWithAggregatesFilter<"subtopics"> | string
    ref?: StringWithAggregatesFilter<"subtopics"> | string
    title?: StringWithAggregatesFilter<"subtopics"> | string
    due_date?: DateTimeNullableWithAggregatesFilter<"subtopics"> | Date | string | null
    sprint_week?: StringNullableWithAggregatesFilter<"subtopics"> | string | null
    qs_total?: IntWithAggregatesFilter<"subtopics"> | number
    mcq_count?: IntWithAggregatesFilter<"subtopics"> | number
    short_ans_count?: IntWithAggregatesFilter<"subtopics"> | number
    structured_count?: IntWithAggregatesFilter<"subtopics"> | number
    extended_count?: IntWithAggregatesFilter<"subtopics"> | number
    status?: StringWithAggregatesFilter<"subtopics"> | string
    sort_order?: IntWithAggregatesFilter<"subtopics"> | number
    created_at?: DateTimeNullableWithAggregatesFilter<"subtopics"> | Date | string | null
    ppt_required?: BoolWithAggregatesFilter<"subtopics"> | boolean
    examples_required?: IntWithAggregatesFilter<"subtopics"> | number
    tier?: StringWithAggregatesFilter<"subtopics"> | string
  }

  export type topicsWhereInput = {
    AND?: topicsWhereInput | topicsWhereInput[]
    OR?: topicsWhereInput[]
    NOT?: topicsWhereInput | topicsWhereInput[]
    id?: UuidFilter<"topics"> | string
    ref?: StringFilter<"topics"> | string
    name?: StringFilter<"topics"> | string
    subtopic_count?: IntFilter<"topics"> | number
    total_questions?: IntFilter<"topics"> | number
    ppt_decks?: IntFilter<"topics"> | number
    completion_date?: DateTimeNullableFilter<"topics"> | Date | string | null
    hours_est?: IntNullableFilter<"topics"> | number | null
    sort_order?: IntFilter<"topics"> | number
    created_at?: DateTimeNullableFilter<"topics"> | Date | string | null
    subject_id?: UuidNullableFilter<"topics"> | string | null
  }

  export type topicsOrderByWithRelationInput = {
    id?: SortOrder
    ref?: SortOrder
    name?: SortOrder
    subtopic_count?: SortOrder
    total_questions?: SortOrder
    ppt_decks?: SortOrder
    completion_date?: SortOrderInput | SortOrder
    hours_est?: SortOrderInput | SortOrder
    sort_order?: SortOrder
    created_at?: SortOrderInput | SortOrder
    subject_id?: SortOrderInput | SortOrder
  }

  export type topicsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: topicsWhereInput | topicsWhereInput[]
    OR?: topicsWhereInput[]
    NOT?: topicsWhereInput | topicsWhereInput[]
    ref?: StringFilter<"topics"> | string
    name?: StringFilter<"topics"> | string
    subtopic_count?: IntFilter<"topics"> | number
    total_questions?: IntFilter<"topics"> | number
    ppt_decks?: IntFilter<"topics"> | number
    completion_date?: DateTimeNullableFilter<"topics"> | Date | string | null
    hours_est?: IntNullableFilter<"topics"> | number | null
    sort_order?: IntFilter<"topics"> | number
    created_at?: DateTimeNullableFilter<"topics"> | Date | string | null
    subject_id?: UuidNullableFilter<"topics"> | string | null
  }, "id">

  export type topicsOrderByWithAggregationInput = {
    id?: SortOrder
    ref?: SortOrder
    name?: SortOrder
    subtopic_count?: SortOrder
    total_questions?: SortOrder
    ppt_decks?: SortOrder
    completion_date?: SortOrderInput | SortOrder
    hours_est?: SortOrderInput | SortOrder
    sort_order?: SortOrder
    created_at?: SortOrderInput | SortOrder
    subject_id?: SortOrderInput | SortOrder
    _count?: topicsCountOrderByAggregateInput
    _avg?: topicsAvgOrderByAggregateInput
    _max?: topicsMaxOrderByAggregateInput
    _min?: topicsMinOrderByAggregateInput
    _sum?: topicsSumOrderByAggregateInput
  }

  export type topicsScalarWhereWithAggregatesInput = {
    AND?: topicsScalarWhereWithAggregatesInput | topicsScalarWhereWithAggregatesInput[]
    OR?: topicsScalarWhereWithAggregatesInput[]
    NOT?: topicsScalarWhereWithAggregatesInput | topicsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"topics"> | string
    ref?: StringWithAggregatesFilter<"topics"> | string
    name?: StringWithAggregatesFilter<"topics"> | string
    subtopic_count?: IntWithAggregatesFilter<"topics"> | number
    total_questions?: IntWithAggregatesFilter<"topics"> | number
    ppt_decks?: IntWithAggregatesFilter<"topics"> | number
    completion_date?: DateTimeNullableWithAggregatesFilter<"topics"> | Date | string | null
    hours_est?: IntNullableWithAggregatesFilter<"topics"> | number | null
    sort_order?: IntWithAggregatesFilter<"topics"> | number
    created_at?: DateTimeNullableWithAggregatesFilter<"topics"> | Date | string | null
    subject_id?: UuidNullableWithAggregatesFilter<"topics"> | string | null
  }

  export type upload_batchesWhereInput = {
    AND?: upload_batchesWhereInput | upload_batchesWhereInput[]
    OR?: upload_batchesWhereInput[]
    NOT?: upload_batchesWhereInput | upload_batchesWhereInput[]
    id?: UuidFilter<"upload_batches"> | string
    created_by?: UuidNullableFilter<"upload_batches"> | string | null
    total_files?: IntFilter<"upload_batches"> | number
    completed_files?: IntFilter<"upload_batches"> | number
    failed_files?: IntFilter<"upload_batches"> | number
    total_questions_extracted?: IntFilter<"upload_batches"> | number
    topic_id?: UuidNullableFilter<"upload_batches"> | string | null
    subtopic_id?: UuidNullableFilter<"upload_batches"> | string | null
    sub_subtopic_id?: UuidNullableFilter<"upload_batches"> | string | null
    status?: StringFilter<"upload_batches"> | string
    created_at?: DateTimeNullableFilter<"upload_batches"> | Date | string | null
    completed_at?: DateTimeNullableFilter<"upload_batches"> | Date | string | null
    source_pdf_path?: StringNullableFilter<"upload_batches"> | string | null
    source_file_name?: StringNullableFilter<"upload_batches"> | string | null
    storage_path?: StringNullableFilter<"upload_batches"> | string | null
    total_questions?: IntNullableFilter<"upload_batches"> | number | null
    questions_extracted?: IntNullableFilter<"upload_batches"> | number | null
    error_message?: StringNullableFilter<"upload_batches"> | string | null
  }

  export type upload_batchesOrderByWithRelationInput = {
    id?: SortOrder
    created_by?: SortOrderInput | SortOrder
    total_files?: SortOrder
    completed_files?: SortOrder
    failed_files?: SortOrder
    total_questions_extracted?: SortOrder
    topic_id?: SortOrderInput | SortOrder
    subtopic_id?: SortOrderInput | SortOrder
    sub_subtopic_id?: SortOrderInput | SortOrder
    status?: SortOrder
    created_at?: SortOrderInput | SortOrder
    completed_at?: SortOrderInput | SortOrder
    source_pdf_path?: SortOrderInput | SortOrder
    source_file_name?: SortOrderInput | SortOrder
    storage_path?: SortOrderInput | SortOrder
    total_questions?: SortOrderInput | SortOrder
    questions_extracted?: SortOrderInput | SortOrder
    error_message?: SortOrderInput | SortOrder
  }

  export type upload_batchesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: upload_batchesWhereInput | upload_batchesWhereInput[]
    OR?: upload_batchesWhereInput[]
    NOT?: upload_batchesWhereInput | upload_batchesWhereInput[]
    created_by?: UuidNullableFilter<"upload_batches"> | string | null
    total_files?: IntFilter<"upload_batches"> | number
    completed_files?: IntFilter<"upload_batches"> | number
    failed_files?: IntFilter<"upload_batches"> | number
    total_questions_extracted?: IntFilter<"upload_batches"> | number
    topic_id?: UuidNullableFilter<"upload_batches"> | string | null
    subtopic_id?: UuidNullableFilter<"upload_batches"> | string | null
    sub_subtopic_id?: UuidNullableFilter<"upload_batches"> | string | null
    status?: StringFilter<"upload_batches"> | string
    created_at?: DateTimeNullableFilter<"upload_batches"> | Date | string | null
    completed_at?: DateTimeNullableFilter<"upload_batches"> | Date | string | null
    source_pdf_path?: StringNullableFilter<"upload_batches"> | string | null
    source_file_name?: StringNullableFilter<"upload_batches"> | string | null
    storage_path?: StringNullableFilter<"upload_batches"> | string | null
    total_questions?: IntNullableFilter<"upload_batches"> | number | null
    questions_extracted?: IntNullableFilter<"upload_batches"> | number | null
    error_message?: StringNullableFilter<"upload_batches"> | string | null
  }, "id">

  export type upload_batchesOrderByWithAggregationInput = {
    id?: SortOrder
    created_by?: SortOrderInput | SortOrder
    total_files?: SortOrder
    completed_files?: SortOrder
    failed_files?: SortOrder
    total_questions_extracted?: SortOrder
    topic_id?: SortOrderInput | SortOrder
    subtopic_id?: SortOrderInput | SortOrder
    sub_subtopic_id?: SortOrderInput | SortOrder
    status?: SortOrder
    created_at?: SortOrderInput | SortOrder
    completed_at?: SortOrderInput | SortOrder
    source_pdf_path?: SortOrderInput | SortOrder
    source_file_name?: SortOrderInput | SortOrder
    storage_path?: SortOrderInput | SortOrder
    total_questions?: SortOrderInput | SortOrder
    questions_extracted?: SortOrderInput | SortOrder
    error_message?: SortOrderInput | SortOrder
    _count?: upload_batchesCountOrderByAggregateInput
    _avg?: upload_batchesAvgOrderByAggregateInput
    _max?: upload_batchesMaxOrderByAggregateInput
    _min?: upload_batchesMinOrderByAggregateInput
    _sum?: upload_batchesSumOrderByAggregateInput
  }

  export type upload_batchesScalarWhereWithAggregatesInput = {
    AND?: upload_batchesScalarWhereWithAggregatesInput | upload_batchesScalarWhereWithAggregatesInput[]
    OR?: upload_batchesScalarWhereWithAggregatesInput[]
    NOT?: upload_batchesScalarWhereWithAggregatesInput | upload_batchesScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"upload_batches"> | string
    created_by?: UuidNullableWithAggregatesFilter<"upload_batches"> | string | null
    total_files?: IntWithAggregatesFilter<"upload_batches"> | number
    completed_files?: IntWithAggregatesFilter<"upload_batches"> | number
    failed_files?: IntWithAggregatesFilter<"upload_batches"> | number
    total_questions_extracted?: IntWithAggregatesFilter<"upload_batches"> | number
    topic_id?: UuidNullableWithAggregatesFilter<"upload_batches"> | string | null
    subtopic_id?: UuidNullableWithAggregatesFilter<"upload_batches"> | string | null
    sub_subtopic_id?: UuidNullableWithAggregatesFilter<"upload_batches"> | string | null
    status?: StringWithAggregatesFilter<"upload_batches"> | string
    created_at?: DateTimeNullableWithAggregatesFilter<"upload_batches"> | Date | string | null
    completed_at?: DateTimeNullableWithAggregatesFilter<"upload_batches"> | Date | string | null
    source_pdf_path?: StringNullableWithAggregatesFilter<"upload_batches"> | string | null
    source_file_name?: StringNullableWithAggregatesFilter<"upload_batches"> | string | null
    storage_path?: StringNullableWithAggregatesFilter<"upload_batches"> | string | null
    total_questions?: IntNullableWithAggregatesFilter<"upload_batches"> | number | null
    questions_extracted?: IntNullableWithAggregatesFilter<"upload_batches"> | number | null
    error_message?: StringNullableWithAggregatesFilter<"upload_batches"> | string | null
  }

  export type answersCreateInput = {
    id?: string
    question_id?: string | null
    content_text?: string | null
    status?: string | null
    created_by?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type answersUncheckedCreateInput = {
    id?: string
    question_id?: string | null
    content_text?: string | null
    status?: string | null
    created_by?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type answersUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: NullableStringFieldUpdateOperationsInput | string | null
    content_text?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type answersUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: NullableStringFieldUpdateOperationsInput | string | null
    content_text?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type answersCreateManyInput = {
    id?: string
    question_id?: string | null
    content_text?: string | null
    status?: string | null
    created_by?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type answersUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: NullableStringFieldUpdateOperationsInput | string | null
    content_text?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type answersUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: NullableStringFieldUpdateOperationsInput | string | null
    content_text?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type databank_chunksCreateInput = {
    id: string
    document_id: string
    content: string
    page_number?: number | null
    chunk_index: number
    token_count?: number | null
    created_at?: Date | string | null
  }

  export type databank_chunksUncheckedCreateInput = {
    id: string
    document_id: string
    content: string
    page_number?: number | null
    chunk_index: number
    token_count?: number | null
    created_at?: Date | string | null
  }

  export type databank_chunksUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    document_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    page_number?: NullableIntFieldUpdateOperationsInput | number | null
    chunk_index?: IntFieldUpdateOperationsInput | number
    token_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type databank_chunksUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    document_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    page_number?: NullableIntFieldUpdateOperationsInput | number | null
    chunk_index?: IntFieldUpdateOperationsInput | number
    token_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type databank_chunksCreateManyInput = {
    id: string
    document_id: string
    content: string
    page_number?: number | null
    chunk_index: number
    token_count?: number | null
    created_at?: Date | string | null
  }

  export type databank_chunksUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    document_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    page_number?: NullableIntFieldUpdateOperationsInput | number | null
    chunk_index?: IntFieldUpdateOperationsInput | number
    token_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type databank_chunksUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    document_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    page_number?: NullableIntFieldUpdateOperationsInput | number | null
    chunk_index?: IntFieldUpdateOperationsInput | number
    token_count?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type databank_documentsCreateInput = {
    id: string
    title: string
    doc_type: string
    topic_id?: string | null
    file_path: string
    file_name: string
    file_size?: number | null
    page_count?: number | null
    chunk_count?: number | null
    processing_status: string
    processing_error?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    subject_id?: string | null
  }

  export type databank_documentsUncheckedCreateInput = {
    id: string
    title: string
    doc_type: string
    topic_id?: string | null
    file_path: string
    file_name: string
    file_size?: number | null
    page_count?: number | null
    chunk_count?: number | null
    processing_status: string
    processing_error?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    subject_id?: string | null
  }

  export type databank_documentsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    doc_type?: StringFieldUpdateOperationsInput | string
    topic_id?: NullableStringFieldUpdateOperationsInput | string | null
    file_path?: StringFieldUpdateOperationsInput | string
    file_name?: StringFieldUpdateOperationsInput | string
    file_size?: NullableIntFieldUpdateOperationsInput | number | null
    page_count?: NullableIntFieldUpdateOperationsInput | number | null
    chunk_count?: NullableIntFieldUpdateOperationsInput | number | null
    processing_status?: StringFieldUpdateOperationsInput | string
    processing_error?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subject_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type databank_documentsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    doc_type?: StringFieldUpdateOperationsInput | string
    topic_id?: NullableStringFieldUpdateOperationsInput | string | null
    file_path?: StringFieldUpdateOperationsInput | string
    file_name?: StringFieldUpdateOperationsInput | string
    file_size?: NullableIntFieldUpdateOperationsInput | number | null
    page_count?: NullableIntFieldUpdateOperationsInput | number | null
    chunk_count?: NullableIntFieldUpdateOperationsInput | number | null
    processing_status?: StringFieldUpdateOperationsInput | string
    processing_error?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subject_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type databank_documentsCreateManyInput = {
    id: string
    title: string
    doc_type: string
    topic_id?: string | null
    file_path: string
    file_name: string
    file_size?: number | null
    page_count?: number | null
    chunk_count?: number | null
    processing_status: string
    processing_error?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    subject_id?: string | null
  }

  export type databank_documentsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    doc_type?: StringFieldUpdateOperationsInput | string
    topic_id?: NullableStringFieldUpdateOperationsInput | string | null
    file_path?: StringFieldUpdateOperationsInput | string
    file_name?: StringFieldUpdateOperationsInput | string
    file_size?: NullableIntFieldUpdateOperationsInput | number | null
    page_count?: NullableIntFieldUpdateOperationsInput | number | null
    chunk_count?: NullableIntFieldUpdateOperationsInput | number | null
    processing_status?: StringFieldUpdateOperationsInput | string
    processing_error?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subject_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type databank_documentsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    doc_type?: StringFieldUpdateOperationsInput | string
    topic_id?: NullableStringFieldUpdateOperationsInput | string | null
    file_path?: StringFieldUpdateOperationsInput | string
    file_name?: StringFieldUpdateOperationsInput | string
    file_size?: NullableIntFieldUpdateOperationsInput | number | null
    page_count?: NullableIntFieldUpdateOperationsInput | number | null
    chunk_count?: NullableIntFieldUpdateOperationsInput | number | null
    processing_status?: StringFieldUpdateOperationsInput | string
    processing_error?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subject_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type exam_boardsCreateInput = {
    id: string
    name: string
    created_at: Date | string
  }

  export type exam_boardsUncheckedCreateInput = {
    id: string
    name: string
    created_at: Date | string
  }

  export type exam_boardsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type exam_boardsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type exam_boardsCreateManyInput = {
    id: string
    name: string
    created_at: Date | string
  }

  export type exam_boardsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type exam_boardsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ppt_decksCreateInput = {
    id?: string
    title?: string | null
    subtopic_id?: string | null
    status?: string | null
    slides?: NullableJsonNullValueInput | InputJsonValue
    created_by?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type ppt_decksUncheckedCreateInput = {
    id?: string
    title?: string | null
    subtopic_id?: string | null
    status?: string | null
    slides?: NullableJsonNullValueInput | InputJsonValue
    created_by?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type ppt_decksUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    slides?: NullableJsonNullValueInput | InputJsonValue
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ppt_decksUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    slides?: NullableJsonNullValueInput | InputJsonValue
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ppt_decksCreateManyInput = {
    id?: string
    title?: string | null
    subtopic_id?: string | null
    status?: string | null
    slides?: NullableJsonNullValueInput | InputJsonValue
    created_by?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type ppt_decksUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    slides?: NullableJsonNullValueInput | InputJsonValue
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ppt_decksUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    slides?: NullableJsonNullValueInput | InputJsonValue
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type production_targetsCreateInput = {
    id: string
    total_target: number
    start_date: Date | string
    end_date: Date | string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    subject_id?: string | null
  }

  export type production_targetsUncheckedCreateInput = {
    id: string
    total_target: number
    start_date: Date | string
    end_date: Date | string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    subject_id?: string | null
  }

  export type production_targetsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    total_target?: IntFieldUpdateOperationsInput | number
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subject_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type production_targetsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    total_target?: IntFieldUpdateOperationsInput | number
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subject_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type production_targetsCreateManyInput = {
    id: string
    total_target: number
    start_date: Date | string
    end_date: Date | string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    subject_id?: string | null
  }

  export type production_targetsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    total_target?: IntFieldUpdateOperationsInput | number
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subject_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type production_targetsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    total_target?: IntFieldUpdateOperationsInput | number
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subject_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type profilesCreateInput = {
    id: string
    email?: string | null
    role?: string | null
    full_name?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type profilesUncheckedCreateInput = {
    id: string
    email?: string | null
    role?: string | null
    full_name?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type profilesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type profilesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type profilesCreateManyInput = {
    id: string
    email?: string | null
    role?: string | null
    full_name?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type profilesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type profilesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type question_imagesCreateInput = {
    id: string
    question_id: string
    storage_path: string
    public_url?: string | null
    image_type: string
    caption?: string | null
    sort_order: number
    uploaded_by?: string | null
    created_at?: Date | string | null
    display_url?: string | null
  }

  export type question_imagesUncheckedCreateInput = {
    id: string
    question_id: string
    storage_path: string
    public_url?: string | null
    image_type: string
    caption?: string | null
    sort_order: number
    uploaded_by?: string | null
    created_at?: Date | string | null
    display_url?: string | null
  }

  export type question_imagesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    storage_path?: StringFieldUpdateOperationsInput | string
    public_url?: NullableStringFieldUpdateOperationsInput | string | null
    image_type?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    sort_order?: IntFieldUpdateOperationsInput | number
    uploaded_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    display_url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type question_imagesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    storage_path?: StringFieldUpdateOperationsInput | string
    public_url?: NullableStringFieldUpdateOperationsInput | string | null
    image_type?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    sort_order?: IntFieldUpdateOperationsInput | number
    uploaded_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    display_url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type question_imagesCreateManyInput = {
    id: string
    question_id: string
    storage_path: string
    public_url?: string | null
    image_type: string
    caption?: string | null
    sort_order: number
    uploaded_by?: string | null
    created_at?: Date | string | null
    display_url?: string | null
  }

  export type question_imagesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    storage_path?: StringFieldUpdateOperationsInput | string
    public_url?: NullableStringFieldUpdateOperationsInput | string | null
    image_type?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    sort_order?: IntFieldUpdateOperationsInput | number
    uploaded_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    display_url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type question_imagesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    storage_path?: StringFieldUpdateOperationsInput | string
    public_url?: NullableStringFieldUpdateOperationsInput | string | null
    image_type?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    sort_order?: IntFieldUpdateOperationsInput | number
    uploaded_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    display_url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type questionsCreateInput = {
    id?: string
    content_text?: string | null
    difficulty?: string | null
    marks?: number | null
    topic_id?: string | null
    subtopic_id?: string | null
    sub_subtopic_id?: string | null
    exam_board_id?: string | null
    status?: string | null
    batch_id?: string | null
    created_by?: string | null
    has_image?: boolean | null
    question_number?: number | null
    source_page?: number | null
    year?: number | null
    paper?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type questionsUncheckedCreateInput = {
    id?: string
    content_text?: string | null
    difficulty?: string | null
    marks?: number | null
    topic_id?: string | null
    subtopic_id?: string | null
    sub_subtopic_id?: string | null
    exam_board_id?: string | null
    status?: string | null
    batch_id?: string | null
    created_by?: string | null
    has_image?: boolean | null
    question_number?: number | null
    source_page?: number | null
    year?: number | null
    paper?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type questionsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content_text?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    marks?: NullableIntFieldUpdateOperationsInput | number | null
    topic_id?: NullableStringFieldUpdateOperationsInput | string | null
    subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    exam_board_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    batch_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    has_image?: NullableBoolFieldUpdateOperationsInput | boolean | null
    question_number?: NullableIntFieldUpdateOperationsInput | number | null
    source_page?: NullableIntFieldUpdateOperationsInput | number | null
    year?: NullableIntFieldUpdateOperationsInput | number | null
    paper?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type questionsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content_text?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    marks?: NullableIntFieldUpdateOperationsInput | number | null
    topic_id?: NullableStringFieldUpdateOperationsInput | string | null
    subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    exam_board_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    batch_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    has_image?: NullableBoolFieldUpdateOperationsInput | boolean | null
    question_number?: NullableIntFieldUpdateOperationsInput | number | null
    source_page?: NullableIntFieldUpdateOperationsInput | number | null
    year?: NullableIntFieldUpdateOperationsInput | number | null
    paper?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type questionsCreateManyInput = {
    id?: string
    content_text?: string | null
    difficulty?: string | null
    marks?: number | null
    topic_id?: string | null
    subtopic_id?: string | null
    sub_subtopic_id?: string | null
    exam_board_id?: string | null
    status?: string | null
    batch_id?: string | null
    created_by?: string | null
    has_image?: boolean | null
    question_number?: number | null
    source_page?: number | null
    year?: number | null
    paper?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type questionsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content_text?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    marks?: NullableIntFieldUpdateOperationsInput | number | null
    topic_id?: NullableStringFieldUpdateOperationsInput | string | null
    subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    exam_board_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    batch_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    has_image?: NullableBoolFieldUpdateOperationsInput | boolean | null
    question_number?: NullableIntFieldUpdateOperationsInput | number | null
    source_page?: NullableIntFieldUpdateOperationsInput | number | null
    year?: NullableIntFieldUpdateOperationsInput | number | null
    paper?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type questionsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content_text?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    marks?: NullableIntFieldUpdateOperationsInput | number | null
    topic_id?: NullableStringFieldUpdateOperationsInput | string | null
    subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    exam_board_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    batch_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    has_image?: NullableBoolFieldUpdateOperationsInput | boolean | null
    question_number?: NullableIntFieldUpdateOperationsInput | number | null
    source_page?: NullableIntFieldUpdateOperationsInput | number | null
    year?: NullableIntFieldUpdateOperationsInput | number | null
    paper?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type sub_subtopicsCreateInput = {
    id: string
    subtopic_id: string
    ext_num: number
    core_num?: number | null
    outcome: string
    tier: string
    notes?: string | null
    sort_order: number
    created_at?: Date | string | null
  }

  export type sub_subtopicsUncheckedCreateInput = {
    id: string
    subtopic_id: string
    ext_num: number
    core_num?: number | null
    outcome: string
    tier: string
    notes?: string | null
    sort_order: number
    created_at?: Date | string | null
  }

  export type sub_subtopicsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    subtopic_id?: StringFieldUpdateOperationsInput | string
    ext_num?: IntFieldUpdateOperationsInput | number
    core_num?: NullableIntFieldUpdateOperationsInput | number | null
    outcome?: StringFieldUpdateOperationsInput | string
    tier?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type sub_subtopicsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    subtopic_id?: StringFieldUpdateOperationsInput | string
    ext_num?: IntFieldUpdateOperationsInput | number
    core_num?: NullableIntFieldUpdateOperationsInput | number | null
    outcome?: StringFieldUpdateOperationsInput | string
    tier?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type sub_subtopicsCreateManyInput = {
    id: string
    subtopic_id: string
    ext_num: number
    core_num?: number | null
    outcome: string
    tier: string
    notes?: string | null
    sort_order: number
    created_at?: Date | string | null
  }

  export type sub_subtopicsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    subtopic_id?: StringFieldUpdateOperationsInput | string
    ext_num?: IntFieldUpdateOperationsInput | number
    core_num?: NullableIntFieldUpdateOperationsInput | number | null
    outcome?: StringFieldUpdateOperationsInput | string
    tier?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type sub_subtopicsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    subtopic_id?: StringFieldUpdateOperationsInput | string
    ext_num?: IntFieldUpdateOperationsInput | number
    core_num?: NullableIntFieldUpdateOperationsInput | number | null
    outcome?: StringFieldUpdateOperationsInput | string
    tier?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type subtopicsCreateInput = {
    id: string
    topic_id: string
    ref: string
    title: string
    due_date?: Date | string | null
    sprint_week?: string | null
    qs_total: number
    mcq_count: number
    short_ans_count: number
    structured_count: number
    extended_count: number
    status: string
    sort_order: number
    created_at?: Date | string | null
    ppt_required: boolean
    examples_required: number
    tier: string
  }

  export type subtopicsUncheckedCreateInput = {
    id: string
    topic_id: string
    ref: string
    title: string
    due_date?: Date | string | null
    sprint_week?: string | null
    qs_total: number
    mcq_count: number
    short_ans_count: number
    structured_count: number
    extended_count: number
    status: string
    sort_order: number
    created_at?: Date | string | null
    ppt_required: boolean
    examples_required: number
    tier: string
  }

  export type subtopicsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    topic_id?: StringFieldUpdateOperationsInput | string
    ref?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    due_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sprint_week?: NullableStringFieldUpdateOperationsInput | string | null
    qs_total?: IntFieldUpdateOperationsInput | number
    mcq_count?: IntFieldUpdateOperationsInput | number
    short_ans_count?: IntFieldUpdateOperationsInput | number
    structured_count?: IntFieldUpdateOperationsInput | number
    extended_count?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ppt_required?: BoolFieldUpdateOperationsInput | boolean
    examples_required?: IntFieldUpdateOperationsInput | number
    tier?: StringFieldUpdateOperationsInput | string
  }

  export type subtopicsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    topic_id?: StringFieldUpdateOperationsInput | string
    ref?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    due_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sprint_week?: NullableStringFieldUpdateOperationsInput | string | null
    qs_total?: IntFieldUpdateOperationsInput | number
    mcq_count?: IntFieldUpdateOperationsInput | number
    short_ans_count?: IntFieldUpdateOperationsInput | number
    structured_count?: IntFieldUpdateOperationsInput | number
    extended_count?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ppt_required?: BoolFieldUpdateOperationsInput | boolean
    examples_required?: IntFieldUpdateOperationsInput | number
    tier?: StringFieldUpdateOperationsInput | string
  }

  export type subtopicsCreateManyInput = {
    id: string
    topic_id: string
    ref: string
    title: string
    due_date?: Date | string | null
    sprint_week?: string | null
    qs_total: number
    mcq_count: number
    short_ans_count: number
    structured_count: number
    extended_count: number
    status: string
    sort_order: number
    created_at?: Date | string | null
    ppt_required: boolean
    examples_required: number
    tier: string
  }

  export type subtopicsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    topic_id?: StringFieldUpdateOperationsInput | string
    ref?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    due_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sprint_week?: NullableStringFieldUpdateOperationsInput | string | null
    qs_total?: IntFieldUpdateOperationsInput | number
    mcq_count?: IntFieldUpdateOperationsInput | number
    short_ans_count?: IntFieldUpdateOperationsInput | number
    structured_count?: IntFieldUpdateOperationsInput | number
    extended_count?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ppt_required?: BoolFieldUpdateOperationsInput | boolean
    examples_required?: IntFieldUpdateOperationsInput | number
    tier?: StringFieldUpdateOperationsInput | string
  }

  export type subtopicsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    topic_id?: StringFieldUpdateOperationsInput | string
    ref?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    due_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sprint_week?: NullableStringFieldUpdateOperationsInput | string | null
    qs_total?: IntFieldUpdateOperationsInput | number
    mcq_count?: IntFieldUpdateOperationsInput | number
    short_ans_count?: IntFieldUpdateOperationsInput | number
    structured_count?: IntFieldUpdateOperationsInput | number
    extended_count?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ppt_required?: BoolFieldUpdateOperationsInput | boolean
    examples_required?: IntFieldUpdateOperationsInput | number
    tier?: StringFieldUpdateOperationsInput | string
  }

  export type topicsCreateInput = {
    id: string
    ref: string
    name: string
    subtopic_count: number
    total_questions: number
    ppt_decks: number
    completion_date?: Date | string | null
    hours_est?: number | null
    sort_order: number
    created_at?: Date | string | null
    subject_id?: string | null
  }

  export type topicsUncheckedCreateInput = {
    id: string
    ref: string
    name: string
    subtopic_count: number
    total_questions: number
    ppt_decks: number
    completion_date?: Date | string | null
    hours_est?: number | null
    sort_order: number
    created_at?: Date | string | null
    subject_id?: string | null
  }

  export type topicsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ref?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subtopic_count?: IntFieldUpdateOperationsInput | number
    total_questions?: IntFieldUpdateOperationsInput | number
    ppt_decks?: IntFieldUpdateOperationsInput | number
    completion_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    hours_est?: NullableIntFieldUpdateOperationsInput | number | null
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subject_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type topicsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ref?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subtopic_count?: IntFieldUpdateOperationsInput | number
    total_questions?: IntFieldUpdateOperationsInput | number
    ppt_decks?: IntFieldUpdateOperationsInput | number
    completion_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    hours_est?: NullableIntFieldUpdateOperationsInput | number | null
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subject_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type topicsCreateManyInput = {
    id: string
    ref: string
    name: string
    subtopic_count: number
    total_questions: number
    ppt_decks: number
    completion_date?: Date | string | null
    hours_est?: number | null
    sort_order: number
    created_at?: Date | string | null
    subject_id?: string | null
  }

  export type topicsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ref?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subtopic_count?: IntFieldUpdateOperationsInput | number
    total_questions?: IntFieldUpdateOperationsInput | number
    ppt_decks?: IntFieldUpdateOperationsInput | number
    completion_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    hours_est?: NullableIntFieldUpdateOperationsInput | number | null
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subject_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type topicsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ref?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subtopic_count?: IntFieldUpdateOperationsInput | number
    total_questions?: IntFieldUpdateOperationsInput | number
    ppt_decks?: IntFieldUpdateOperationsInput | number
    completion_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    hours_est?: NullableIntFieldUpdateOperationsInput | number | null
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subject_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type upload_batchesCreateInput = {
    id: string
    created_by?: string | null
    total_files: number
    completed_files: number
    failed_files: number
    total_questions_extracted: number
    topic_id?: string | null
    subtopic_id?: string | null
    sub_subtopic_id?: string | null
    status: string
    created_at?: Date | string | null
    completed_at?: Date | string | null
    source_pdf_path?: string | null
    source_file_name?: string | null
    storage_path?: string | null
    total_questions?: number | null
    questions_extracted?: number | null
    error_message?: string | null
  }

  export type upload_batchesUncheckedCreateInput = {
    id: string
    created_by?: string | null
    total_files: number
    completed_files: number
    failed_files: number
    total_questions_extracted: number
    topic_id?: string | null
    subtopic_id?: string | null
    sub_subtopic_id?: string | null
    status: string
    created_at?: Date | string | null
    completed_at?: Date | string | null
    source_pdf_path?: string | null
    source_file_name?: string | null
    storage_path?: string | null
    total_questions?: number | null
    questions_extracted?: number | null
    error_message?: string | null
  }

  export type upload_batchesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    total_files?: IntFieldUpdateOperationsInput | number
    completed_files?: IntFieldUpdateOperationsInput | number
    failed_files?: IntFieldUpdateOperationsInput | number
    total_questions_extracted?: IntFieldUpdateOperationsInput | number
    topic_id?: NullableStringFieldUpdateOperationsInput | string | null
    subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    source_pdf_path?: NullableStringFieldUpdateOperationsInput | string | null
    source_file_name?: NullableStringFieldUpdateOperationsInput | string | null
    storage_path?: NullableStringFieldUpdateOperationsInput | string | null
    total_questions?: NullableIntFieldUpdateOperationsInput | number | null
    questions_extracted?: NullableIntFieldUpdateOperationsInput | number | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type upload_batchesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    total_files?: IntFieldUpdateOperationsInput | number
    completed_files?: IntFieldUpdateOperationsInput | number
    failed_files?: IntFieldUpdateOperationsInput | number
    total_questions_extracted?: IntFieldUpdateOperationsInput | number
    topic_id?: NullableStringFieldUpdateOperationsInput | string | null
    subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    source_pdf_path?: NullableStringFieldUpdateOperationsInput | string | null
    source_file_name?: NullableStringFieldUpdateOperationsInput | string | null
    storage_path?: NullableStringFieldUpdateOperationsInput | string | null
    total_questions?: NullableIntFieldUpdateOperationsInput | number | null
    questions_extracted?: NullableIntFieldUpdateOperationsInput | number | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type upload_batchesCreateManyInput = {
    id: string
    created_by?: string | null
    total_files: number
    completed_files: number
    failed_files: number
    total_questions_extracted: number
    topic_id?: string | null
    subtopic_id?: string | null
    sub_subtopic_id?: string | null
    status: string
    created_at?: Date | string | null
    completed_at?: Date | string | null
    source_pdf_path?: string | null
    source_file_name?: string | null
    storage_path?: string | null
    total_questions?: number | null
    questions_extracted?: number | null
    error_message?: string | null
  }

  export type upload_batchesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    total_files?: IntFieldUpdateOperationsInput | number
    completed_files?: IntFieldUpdateOperationsInput | number
    failed_files?: IntFieldUpdateOperationsInput | number
    total_questions_extracted?: IntFieldUpdateOperationsInput | number
    topic_id?: NullableStringFieldUpdateOperationsInput | string | null
    subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    source_pdf_path?: NullableStringFieldUpdateOperationsInput | string | null
    source_file_name?: NullableStringFieldUpdateOperationsInput | string | null
    storage_path?: NullableStringFieldUpdateOperationsInput | string | null
    total_questions?: NullableIntFieldUpdateOperationsInput | number | null
    questions_extracted?: NullableIntFieldUpdateOperationsInput | number | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type upload_batchesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    total_files?: IntFieldUpdateOperationsInput | number
    completed_files?: IntFieldUpdateOperationsInput | number
    failed_files?: IntFieldUpdateOperationsInput | number
    total_questions_extracted?: IntFieldUpdateOperationsInput | number
    topic_id?: NullableStringFieldUpdateOperationsInput | string | null
    subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_subtopic_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    source_pdf_path?: NullableStringFieldUpdateOperationsInput | string | null
    source_file_name?: NullableStringFieldUpdateOperationsInput | string | null
    storage_path?: NullableStringFieldUpdateOperationsInput | string | null
    total_questions?: NullableIntFieldUpdateOperationsInput | number | null
    questions_extracted?: NullableIntFieldUpdateOperationsInput | number | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type answersCountOrderByAggregateInput = {
    id?: SortOrder
    question_id?: SortOrder
    content_text?: SortOrder
    status?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type answersMaxOrderByAggregateInput = {
    id?: SortOrder
    question_id?: SortOrder
    content_text?: SortOrder
    status?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type answersMinOrderByAggregateInput = {
    id?: SortOrder
    question_id?: SortOrder
    content_text?: SortOrder
    status?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type databank_chunksCountOrderByAggregateInput = {
    id?: SortOrder
    document_id?: SortOrder
    content?: SortOrder
    page_number?: SortOrder
    chunk_index?: SortOrder
    token_count?: SortOrder
    created_at?: SortOrder
  }

  export type databank_chunksAvgOrderByAggregateInput = {
    page_number?: SortOrder
    chunk_index?: SortOrder
    token_count?: SortOrder
  }

  export type databank_chunksMaxOrderByAggregateInput = {
    id?: SortOrder
    document_id?: SortOrder
    content?: SortOrder
    page_number?: SortOrder
    chunk_index?: SortOrder
    token_count?: SortOrder
    created_at?: SortOrder
  }

  export type databank_chunksMinOrderByAggregateInput = {
    id?: SortOrder
    document_id?: SortOrder
    content?: SortOrder
    page_number?: SortOrder
    chunk_index?: SortOrder
    token_count?: SortOrder
    created_at?: SortOrder
  }

  export type databank_chunksSumOrderByAggregateInput = {
    page_number?: SortOrder
    chunk_index?: SortOrder
    token_count?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type databank_documentsCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    doc_type?: SortOrder
    topic_id?: SortOrder
    file_path?: SortOrder
    file_name?: SortOrder
    file_size?: SortOrder
    page_count?: SortOrder
    chunk_count?: SortOrder
    processing_status?: SortOrder
    processing_error?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    subject_id?: SortOrder
  }

  export type databank_documentsAvgOrderByAggregateInput = {
    file_size?: SortOrder
    page_count?: SortOrder
    chunk_count?: SortOrder
  }

  export type databank_documentsMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    doc_type?: SortOrder
    topic_id?: SortOrder
    file_path?: SortOrder
    file_name?: SortOrder
    file_size?: SortOrder
    page_count?: SortOrder
    chunk_count?: SortOrder
    processing_status?: SortOrder
    processing_error?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    subject_id?: SortOrder
  }

  export type databank_documentsMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    doc_type?: SortOrder
    topic_id?: SortOrder
    file_path?: SortOrder
    file_name?: SortOrder
    file_size?: SortOrder
    page_count?: SortOrder
    chunk_count?: SortOrder
    processing_status?: SortOrder
    processing_error?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    subject_id?: SortOrder
  }

  export type databank_documentsSumOrderByAggregateInput = {
    file_size?: SortOrder
    page_count?: SortOrder
    chunk_count?: SortOrder
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type exam_boardsCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
  }

  export type exam_boardsMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
  }

  export type exam_boardsMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ppt_decksCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    subtopic_id?: SortOrder
    status?: SortOrder
    slides?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ppt_decksMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    subtopic_id?: SortOrder
    status?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ppt_decksMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    subtopic_id?: SortOrder
    status?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type production_targetsCountOrderByAggregateInput = {
    id?: SortOrder
    total_target?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    subject_id?: SortOrder
  }

  export type production_targetsAvgOrderByAggregateInput = {
    total_target?: SortOrder
  }

  export type production_targetsMaxOrderByAggregateInput = {
    id?: SortOrder
    total_target?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    subject_id?: SortOrder
  }

  export type production_targetsMinOrderByAggregateInput = {
    id?: SortOrder
    total_target?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    subject_id?: SortOrder
  }

  export type production_targetsSumOrderByAggregateInput = {
    total_target?: SortOrder
  }

  export type profilesCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    role?: SortOrder
    full_name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type profilesMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    role?: SortOrder
    full_name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type profilesMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    role?: SortOrder
    full_name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type question_imagesCountOrderByAggregateInput = {
    id?: SortOrder
    question_id?: SortOrder
    storage_path?: SortOrder
    public_url?: SortOrder
    image_type?: SortOrder
    caption?: SortOrder
    sort_order?: SortOrder
    uploaded_by?: SortOrder
    created_at?: SortOrder
    display_url?: SortOrder
  }

  export type question_imagesAvgOrderByAggregateInput = {
    sort_order?: SortOrder
  }

  export type question_imagesMaxOrderByAggregateInput = {
    id?: SortOrder
    question_id?: SortOrder
    storage_path?: SortOrder
    public_url?: SortOrder
    image_type?: SortOrder
    caption?: SortOrder
    sort_order?: SortOrder
    uploaded_by?: SortOrder
    created_at?: SortOrder
    display_url?: SortOrder
  }

  export type question_imagesMinOrderByAggregateInput = {
    id?: SortOrder
    question_id?: SortOrder
    storage_path?: SortOrder
    public_url?: SortOrder
    image_type?: SortOrder
    caption?: SortOrder
    sort_order?: SortOrder
    uploaded_by?: SortOrder
    created_at?: SortOrder
    display_url?: SortOrder
  }

  export type question_imagesSumOrderByAggregateInput = {
    sort_order?: SortOrder
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type questionsCountOrderByAggregateInput = {
    id?: SortOrder
    content_text?: SortOrder
    difficulty?: SortOrder
    marks?: SortOrder
    topic_id?: SortOrder
    subtopic_id?: SortOrder
    sub_subtopic_id?: SortOrder
    exam_board_id?: SortOrder
    status?: SortOrder
    batch_id?: SortOrder
    created_by?: SortOrder
    has_image?: SortOrder
    question_number?: SortOrder
    source_page?: SortOrder
    year?: SortOrder
    paper?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type questionsAvgOrderByAggregateInput = {
    marks?: SortOrder
    question_number?: SortOrder
    source_page?: SortOrder
    year?: SortOrder
  }

  export type questionsMaxOrderByAggregateInput = {
    id?: SortOrder
    content_text?: SortOrder
    difficulty?: SortOrder
    marks?: SortOrder
    topic_id?: SortOrder
    subtopic_id?: SortOrder
    sub_subtopic_id?: SortOrder
    exam_board_id?: SortOrder
    status?: SortOrder
    batch_id?: SortOrder
    created_by?: SortOrder
    has_image?: SortOrder
    question_number?: SortOrder
    source_page?: SortOrder
    year?: SortOrder
    paper?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type questionsMinOrderByAggregateInput = {
    id?: SortOrder
    content_text?: SortOrder
    difficulty?: SortOrder
    marks?: SortOrder
    topic_id?: SortOrder
    subtopic_id?: SortOrder
    sub_subtopic_id?: SortOrder
    exam_board_id?: SortOrder
    status?: SortOrder
    batch_id?: SortOrder
    created_by?: SortOrder
    has_image?: SortOrder
    question_number?: SortOrder
    source_page?: SortOrder
    year?: SortOrder
    paper?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type questionsSumOrderByAggregateInput = {
    marks?: SortOrder
    question_number?: SortOrder
    source_page?: SortOrder
    year?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type sub_subtopicsCountOrderByAggregateInput = {
    id?: SortOrder
    subtopic_id?: SortOrder
    ext_num?: SortOrder
    core_num?: SortOrder
    outcome?: SortOrder
    tier?: SortOrder
    notes?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
  }

  export type sub_subtopicsAvgOrderByAggregateInput = {
    ext_num?: SortOrder
    core_num?: SortOrder
    sort_order?: SortOrder
  }

  export type sub_subtopicsMaxOrderByAggregateInput = {
    id?: SortOrder
    subtopic_id?: SortOrder
    ext_num?: SortOrder
    core_num?: SortOrder
    outcome?: SortOrder
    tier?: SortOrder
    notes?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
  }

  export type sub_subtopicsMinOrderByAggregateInput = {
    id?: SortOrder
    subtopic_id?: SortOrder
    ext_num?: SortOrder
    core_num?: SortOrder
    outcome?: SortOrder
    tier?: SortOrder
    notes?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
  }

  export type sub_subtopicsSumOrderByAggregateInput = {
    ext_num?: SortOrder
    core_num?: SortOrder
    sort_order?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type subtopicsCountOrderByAggregateInput = {
    id?: SortOrder
    topic_id?: SortOrder
    ref?: SortOrder
    title?: SortOrder
    due_date?: SortOrder
    sprint_week?: SortOrder
    qs_total?: SortOrder
    mcq_count?: SortOrder
    short_ans_count?: SortOrder
    structured_count?: SortOrder
    extended_count?: SortOrder
    status?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
    ppt_required?: SortOrder
    examples_required?: SortOrder
    tier?: SortOrder
  }

  export type subtopicsAvgOrderByAggregateInput = {
    qs_total?: SortOrder
    mcq_count?: SortOrder
    short_ans_count?: SortOrder
    structured_count?: SortOrder
    extended_count?: SortOrder
    sort_order?: SortOrder
    examples_required?: SortOrder
  }

  export type subtopicsMaxOrderByAggregateInput = {
    id?: SortOrder
    topic_id?: SortOrder
    ref?: SortOrder
    title?: SortOrder
    due_date?: SortOrder
    sprint_week?: SortOrder
    qs_total?: SortOrder
    mcq_count?: SortOrder
    short_ans_count?: SortOrder
    structured_count?: SortOrder
    extended_count?: SortOrder
    status?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
    ppt_required?: SortOrder
    examples_required?: SortOrder
    tier?: SortOrder
  }

  export type subtopicsMinOrderByAggregateInput = {
    id?: SortOrder
    topic_id?: SortOrder
    ref?: SortOrder
    title?: SortOrder
    due_date?: SortOrder
    sprint_week?: SortOrder
    qs_total?: SortOrder
    mcq_count?: SortOrder
    short_ans_count?: SortOrder
    structured_count?: SortOrder
    extended_count?: SortOrder
    status?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
    ppt_required?: SortOrder
    examples_required?: SortOrder
    tier?: SortOrder
  }

  export type subtopicsSumOrderByAggregateInput = {
    qs_total?: SortOrder
    mcq_count?: SortOrder
    short_ans_count?: SortOrder
    structured_count?: SortOrder
    extended_count?: SortOrder
    sort_order?: SortOrder
    examples_required?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type topicsCountOrderByAggregateInput = {
    id?: SortOrder
    ref?: SortOrder
    name?: SortOrder
    subtopic_count?: SortOrder
    total_questions?: SortOrder
    ppt_decks?: SortOrder
    completion_date?: SortOrder
    hours_est?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
    subject_id?: SortOrder
  }

  export type topicsAvgOrderByAggregateInput = {
    subtopic_count?: SortOrder
    total_questions?: SortOrder
    ppt_decks?: SortOrder
    hours_est?: SortOrder
    sort_order?: SortOrder
  }

  export type topicsMaxOrderByAggregateInput = {
    id?: SortOrder
    ref?: SortOrder
    name?: SortOrder
    subtopic_count?: SortOrder
    total_questions?: SortOrder
    ppt_decks?: SortOrder
    completion_date?: SortOrder
    hours_est?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
    subject_id?: SortOrder
  }

  export type topicsMinOrderByAggregateInput = {
    id?: SortOrder
    ref?: SortOrder
    name?: SortOrder
    subtopic_count?: SortOrder
    total_questions?: SortOrder
    ppt_decks?: SortOrder
    completion_date?: SortOrder
    hours_est?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
    subject_id?: SortOrder
  }

  export type topicsSumOrderByAggregateInput = {
    subtopic_count?: SortOrder
    total_questions?: SortOrder
    ppt_decks?: SortOrder
    hours_est?: SortOrder
    sort_order?: SortOrder
  }

  export type upload_batchesCountOrderByAggregateInput = {
    id?: SortOrder
    created_by?: SortOrder
    total_files?: SortOrder
    completed_files?: SortOrder
    failed_files?: SortOrder
    total_questions_extracted?: SortOrder
    topic_id?: SortOrder
    subtopic_id?: SortOrder
    sub_subtopic_id?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    completed_at?: SortOrder
    source_pdf_path?: SortOrder
    source_file_name?: SortOrder
    storage_path?: SortOrder
    total_questions?: SortOrder
    questions_extracted?: SortOrder
    error_message?: SortOrder
  }

  export type upload_batchesAvgOrderByAggregateInput = {
    total_files?: SortOrder
    completed_files?: SortOrder
    failed_files?: SortOrder
    total_questions_extracted?: SortOrder
    total_questions?: SortOrder
    questions_extracted?: SortOrder
  }

  export type upload_batchesMaxOrderByAggregateInput = {
    id?: SortOrder
    created_by?: SortOrder
    total_files?: SortOrder
    completed_files?: SortOrder
    failed_files?: SortOrder
    total_questions_extracted?: SortOrder
    topic_id?: SortOrder
    subtopic_id?: SortOrder
    sub_subtopic_id?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    completed_at?: SortOrder
    source_pdf_path?: SortOrder
    source_file_name?: SortOrder
    storage_path?: SortOrder
    total_questions?: SortOrder
    questions_extracted?: SortOrder
    error_message?: SortOrder
  }

  export type upload_batchesMinOrderByAggregateInput = {
    id?: SortOrder
    created_by?: SortOrder
    total_files?: SortOrder
    completed_files?: SortOrder
    failed_files?: SortOrder
    total_questions_extracted?: SortOrder
    topic_id?: SortOrder
    subtopic_id?: SortOrder
    sub_subtopic_id?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    completed_at?: SortOrder
    source_pdf_path?: SortOrder
    source_file_name?: SortOrder
    storage_path?: SortOrder
    total_questions?: SortOrder
    questions_extracted?: SortOrder
    error_message?: SortOrder
  }

  export type upload_batchesSumOrderByAggregateInput = {
    total_files?: SortOrder
    completed_files?: SortOrder
    failed_files?: SortOrder
    total_questions_extracted?: SortOrder
    total_questions?: SortOrder
    questions_extracted?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}