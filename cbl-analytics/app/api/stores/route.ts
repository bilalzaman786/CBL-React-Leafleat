import { processStoreData } from '@/utils/storeDataProcessor';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the store data file from the project directory
    const rawData = fs.readFileSync(path.join(process.cwd(), '../store-data.txt'), 'utf-8');
    
    // Process the data using the utility function
    const stores = processStoreData(rawData);
    
    // Return the processed data
    return NextResponse.json({ stores });
  } catch (error) {
    console.error('Error loading store data:', error);
    return NextResponse.json({ error: 'Failed to load store data' }, { status: 500 });
  }
}