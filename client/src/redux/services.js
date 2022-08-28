import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


// Define a service using a base URL and expected endpoints
export const brApi = createApi({
  reducerPath: 'brApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/' }),
  tagTypes: ['Users', 'Bikes', 'Bookings'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: loginData => ({
        url: '/signin',
        method: 'POST',
        body: loginData
      }),
      invalidatesTags: ['Users']
    }),
    getUsers: builder.query({
      query: ({queryBy, value} = {queryBy: undefined, value: undefined}) => {
        let url = `/users`;
        if(!queryBy || !value) return url;
        else if(queryBy === 'id') return `${url}/${value}`;
        else return `${url}?${queryBy}=${value}`
      },
      providesTags: ['User']
    }),
    signUp: builder.mutation({
      query: data => ({
        url: '/signup',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Users']
    }),
    updateUser: builder.mutation({
      query: data => ({
        url: `/users/${data.id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['Users']
    }),
    deleteUser: builder.mutation({
      query: id => ({
        url: `/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Users']
    }),
    addBike: builder.mutation({
      query: data => ({
        url: '/bikes',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Bikes']
    }),
    updateBike: builder.mutation({
      query: data => ({
        url: `/bikes/${data.id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['Bikes']
    }),
    deleteBike: builder.mutation({
      query: id => ({
        url: `/bikes/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Bikes']
    }),
    getBikes: builder.query({
      query: ({queryBy, value} = {queryBy: undefined, value: undefined}) => {
        let url = `/bikes`;
        if(!queryBy || !value) return url;
        else if(queryBy === 'id') return `${url}/${value}`;
        
        if(typeof queryBy === 'object'){
          url = url+'?';
          url = queryBy.reduce((prev, curr, idx) => {
            return `${prev}${curr}=${value[idx]}&`
          },url);
          
          return url;
        }
        return `${url}?${queryBy}=${value}`;
      },
      providesTags: ['Bikes']
    }),
    getBookings: builder.query({
      query: ({queryBy, value} = {queryBy: undefined, value: undefined}) => {
        let url = `/bookings`;
        if(!queryBy || !value) return url;
        else if(queryBy === 'id') return `${url}/${value}`;
        
        if(typeof queryBy === 'object'){
          url = url+'?';
          url = queryBy.reduce((prev, curr, idx) => {
            return `${prev}${curr}=${value[idx]}&`
          },url);
          
          return url;
        }
        return `${url}?${queryBy}=${value}`;
      },
      providesTags: ['Bookings']
    }),
    addBooking: builder.mutation({
      query: data => ({
        url: '/bookings',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Bookings']
    }),
    updateBooking: builder.mutation({
      query: data => ({
        url: `/bookings/${data.id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['Bookings']
    }),
    getBikeRating: builder.query({
      query: bikeId => `/bookings?bikeId=${bikeId}`,
      providesTags: ['Bikes', 'Bookings'],
      transformResponse: (response) => {
        response = response.filter(({ rating }) => rating)
        const rating = Math.floor(response.reduce((prev, curr) => prev + curr.rating, 0) / response.length);
        return rating;
      }
    })
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useGetUsersQuery,
  useSignUpMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAddBikeMutation,
  useUpdateBikeMutation,
  useDeleteBikeMutation,
  useGetBikesQuery,
  useGetBookingsQuery,
  useAddBookingMutation,
  useUpdateBookingMutation,
  useGetBikeRatingQuery
} = brApi