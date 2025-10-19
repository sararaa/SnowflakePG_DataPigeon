import snowflakeSDK from 'snowflake-sdk';

// Simple Snowflake connection without pooling
export class SimpleSnowflakeClient {
  private connection: any;

  async connect() {
    if (this.connection) {
      return this.connection;
    }

    return new Promise((resolve, reject) => {
      const connection = snowflakeSDK.createConnection({
        account: process.env.SNOWFLAKE_ACCOUNT!,
        username: process.env.SNOWFLAKE_USERNAME!,
        password: process.env.SNOWFLAKE_PASSWORD!,
        database: process.env.SNOWFLAKE_DATABASE!,
        schema: process.env.SNOWFLAKE_SCHEMA || 'PUBLIC',
        warehouse: process.env.SNOWFLAKE_WAREHOUSE!,
        role: process.env.SNOWFLAKE_ROLE || 'ACCOUNTADMIN',
      });

      connection.connect((err: any, conn: any) => {
        if (err) {
          console.error('Snowflake connection error:', err);
          reject(err);
        } else {
          console.log('Snowflake connected successfully');
          this.connection = conn;
          resolve(conn);
        }
      });
    });
  }

  async query(sql: string, params: any[] = []): Promise<{ data: any[]; error: any }> {
    try {
      const conn = await this.connect();
      
      return new Promise((resolve) => {
        conn.execute({
          sqlText: sql,
          binds: params,
          complete: (err: any, stmt: any, rows: any) => {
            if (err) {
              console.error('Query error:', err);
              resolve({ data: [], error: err });
            } else {
              resolve({ data: rows || [], error: null });
            }
          }
        });
      });
    } catch (error) {
      console.error('Snowflake query error:', error);
      return { data: [], error };
    }
  }

  async disconnect() {
    if (this.connection) {
      this.connection.destroy();
      this.connection = null;
    }
  }
}

// Export singleton instance
export const simpleSnowflake = new SimpleSnowflakeClient();
