// src/ai/flows/claim-risk-assessment.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for assessing the risk level of a submitted claim.
 *
 * The flow analyzes claim details and document results to provide a risk score and label, aiding investigators in prioritizing potentially fraudulent claims.
 *
 * @interface ClaimRiskAssessmentInput - Defines the input schema for the claim risk assessment flow.
 * @interface ClaimRiskAssessmentOutput - Defines the output schema for the claim risk assessment flow, including risk score and rationale.
 * @function assessClaimRisk - An exported function that takes ClaimRiskAssessmentInput and returns a Promise of ClaimRiskAssessmentOutput.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the claim risk assessment
const ClaimRiskAssessmentInputSchema = z.object({
  claimDetails: z
    .string()
    .describe('Detailed information about the insurance claim, including policy number, amount, and description.'),
  documentResults: z
    .string()
    .describe('Results from document forgery detection, indicating whether forgery is suspected.'),
});
export type ClaimRiskAssessmentInput = z.infer<typeof ClaimRiskAssessmentInputSchema>;

// Define the output schema for the claim risk assessment
const ClaimRiskAssessmentOutputSchema = z.object({
  riskScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A numerical risk score between 0 and 100, indicating the likelihood of fraud.'),
  riskLabel: z
    .enum(['Low', 'Medium', 'High'])
    .describe('A categorical risk label (Low, Medium, High) based on the risk score.'),
  rationale: z
    .string()
    .describe('A detailed explanation of the factors contributing to the assigned risk level.'),
});
export type ClaimRiskAssessmentOutput = z.infer<typeof ClaimRiskAssessmentOutputSchema>;


export async function assessClaimRisk(input: ClaimRiskAssessmentInput): Promise<ClaimRiskAssessmentOutput> {
  return assessClaimRiskFlow(input);
}

const claimRiskAssessmentPrompt = ai.definePrompt({
  name: 'claimRiskAssessmentPrompt',
  input: {schema: ClaimRiskAssessmentInputSchema},
  output: {schema: ClaimRiskAssessmentOutputSchema},
  prompt: `You are an AI assistant specialized in fraud detection for insurance claims.
  Analyze the provided claim details and document verification results to assess the risk of fraud.
  Provide a risk score (0-100), a risk label (Low, Medium, High), and a detailed rationale for your assessment.

  Claim Details: {{{claimDetails}}}
  Document Verification Results: {{{documentResults}}}

  Consider factors such as inconsistencies in the claim, potential forgery, and any other relevant information.
  Ensure the risk score, label, and rationale are consistent and well-justified.
`,
});

const assessClaimRiskFlow = ai.defineFlow(
  {
    name: 'assessClaimRiskFlow',
    inputSchema: ClaimRiskAssessmentInputSchema,
    outputSchema: ClaimRiskAssessmentOutputSchema,
  },
  async input => {
    const {output} = await claimRiskAssessmentPrompt(input);
    return output!;
  }
);
