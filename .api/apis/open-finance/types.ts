import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';

export type PostTokenBodyParam = FromSchema<typeof schemas.PostToken.body>;
export type PostTokenResponse200 = FromSchema<typeof schemas.PostToken.response['200']>;
