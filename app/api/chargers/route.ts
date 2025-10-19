import { NextRequest, NextResponse } from 'next/server';
import { simpleSnowflake } from '@/lib/snowflake-simple';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await simpleSnowflake.query('SELECT * FROM CHARGERS');
    
    if (error) {
      console.error('Snowflake query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
