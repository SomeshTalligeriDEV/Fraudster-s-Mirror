'use server';
/**
 * @fileOverview Provides explainable AI output for fraud claims.
 *
 * - getFraudExplanation - A function that returns an explanation for a claim's fraud risk.
 * - FraudExplanationInput - The input type for the getFraudExplanation function.
 * - FraudExplanationOutput - The return type for the getFraudExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FraudExplanationInputSchema = z.object({
  claimDetails: z.string().describe('Details of the claim, including amount, policy number, and description.'),
  riskScore: z.number().describe('The risk score (0-100) assigned to the claim.'),
  riskLabel: z.string().describe('The risk label (Low/Medium/High) assigned to the claim.'),
  documentAnalysis: z.string().describe('Result of document analysis, indicating potential forgeries or discrepancies.'),
  claimHistory: z.string().describe('History of claims associated with the claimant or policy.'),
});
export type FraudExplanationInput = z.infer<typeof FraudExplanationInputSchema>;

const FraudExplanationOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the factors contributing to the fraud risk assessment.'),
});
export type FraudExplanationOutput = z.infer<typeof FraudExplanationOutputSchema>;

export async function getFraudExplanation(input: FraudExplanationInput): Promise<FraudExplanationOutput> {
  return fraudExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fraudExplanationPrompt',
  input: {schema: FraudExplanationInputSchema},
  output: {schema: FraudExplanationOutputSchema},
  prompt: `You are an AI assistant specialized in explaining fraud risk assessments for insurance claims.

  Based on the following information, provide a clear and concise explanation of why the claim was flagged as potentially fraudulent.

  Claim Details: {{{claimDetails}}}
  Risk Score: {{{riskScore}}}
  Risk Label: {{{riskLabel}}}
  Document Analysis: {{{documentAnalysis}}}
  Claim History: {{{claimHistory}}}

  Focus on the key factors that contributed to the risk assessment, such as unusual claim amounts, inconsistencies in the documentation, or a history of suspicious claims.  Provide a rationale that an investigator can use to understand the AI's reasoning.
  The explanation should be in a single paragraph.
  `,
});

const fraudExplanationFlow = ai.defineFlow(
  {
    name: 'fraudExplanationFlow',
    inputSchema: FraudExplanationInputSchema,
    outputSchema: FraudExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
