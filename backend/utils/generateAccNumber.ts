import { prisma } from "../prisma/prisma";

const BANK_CODE = "747";

function calculateCheckDigit(base9: string): number {
  const weights = [3, 7, 3];
  let sum = 0;

  for (let i = 0; i < base9.length; i++) {
    sum += parseInt(base9[i], 10) * weights[i % weights.length];
  }

  return (10 - (sum % 10)) % 10;
}

export async function generateAccountNumber(): Promise<string> {
  const rows = await prisma.$queryRaw<Array<{ serial: string }>>`
    SELECT to_char(nextval('account_seq'), 'FM000000') AS serial
  `;
  if (!rows?.length) throw new Error("Failed to fetch next account serial");

  const serial = rows[0].serial;
  const base = BANK_CODE + serial;
  const checkDigit = calculateCheckDigit(base);
  return base + String(checkDigit);
}

export function validateAccountNumber(accountNumber: string): boolean {
  const digits = accountNumber.replace(/\D/g, "");
  if (digits.length !== 10) return false;

  const base = digits.slice(0, 9);
  const provided = parseInt(digits[9], 10);

  return calculateCheckDigit(base) === provided;
}
