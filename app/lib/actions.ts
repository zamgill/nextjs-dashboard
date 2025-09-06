'use server';

import * as db from '@/app/lib/data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import z from 'zod';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await db.insertInvoice({ customer_id: customerId, amount: amountInCents, status, date });
  } catch (error) {
    console.error(error);
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });
export async function updateInvoice(id: string, formData: FormData) {
  const formEntries = Object.fromEntries(formData.entries());
  const { customerId, amount, status } = UpdateInvoice.parse(formEntries);

  const amountInCents = amount * 100;

  try {
    await db.updateInvoice({
      id,
      customer_id: customerId,
      amount: amountInCents,
      status,
    });
  } catch (error) {
    console.error(error);
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await db.deleteInvoice(id);
  } catch (error) {
    console.error(error);
  }

  revalidatePath('/dashboard/invoices');
}
