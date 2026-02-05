import { defineConfig } from 'orval';

export default defineConfig({
  petstore: {
    input: {
      target: './petstore.yaml',
    },
    output: {
      target: 'src/petstore.ts',
      client: 'axios',
      baseUrl: '/api/v2',
      mode: 'split',
      schemas: 'src/model',
      mock: {
        type: 'msw',
        delay: 50,
        useExamples: false,
      },
      docs: true,
    },
  },
});
