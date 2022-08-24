import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


// Define a service using a base URL and expected endpoints
export const brApi = createApi({
  reducerPath: 'brApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation({
        query: loginData => ({
            url: '/login',
            method: 'POST',
            body: loginData    
        }),
        invalidatesTags: ['User']
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation } = brApi