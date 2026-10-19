import { z } from 'zod';

export const contactTopics = ['support', 'partnership', 'feedback', 'other'] as const;
export type ContactTopic = (typeof contactTopics)[number];

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'nameMin' })
    .max(80, { message: 'nameMax' }),
  email: z
    .string()
    .trim()
    .email({ message: 'emailInvalid' }),
  topic: z.enum(contactTopics, {
    message: 'topicRequired',
  }),
  message: z
    .string()
    .trim()
    .min(10, { message: 'messageMin' })
    .max(2000, { message: 'messageMax' }),
  consent: z.literal(true, {
    message: 'consentRequired',
  }),
  website: z.string().optional(),
  turnstileToken: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
