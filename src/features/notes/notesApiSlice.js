import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const noteAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = noteAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => "/notes",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadNotes = responseData.map((note) => {
          note.id = note._id;
          return note;
        });
        return noteAdapter.setAll(initialState, loadNotes);
      },
      providesTags: (result, err, arg) => {
        if (result?.ids) {
          return [
            { type: "Note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Note", id })),
          ];
        } else return [{ type: "Note", id: "LIST" }];
      },
    }),
    addNewNote: builder.mutation({
      query: (initialNote) => ({
        url: "/notes",
        method: "POST",
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: [{ type: "Note", id: "LIST" }],
    }),
    updateNote: builder.mutation({
      query: (initialNote) => ({
        url: "/notes",
        method: "PATCH",
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: `/notes`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;

// returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// creates memoised selector
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data
);

// getSelectors create these selectors and we rename them
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
} = noteAdapter.getSelectors((state) => selectNotesData(state) ?? initialState);
