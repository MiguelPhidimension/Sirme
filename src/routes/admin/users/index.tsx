import {
  component$,
  useSignal,
  $,
  useResource$,
  Resource,
  useContext,
} from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { graphqlClient } from "~/graphql/client";
import { LuSearch } from "@qwikest/icons/lucide";
import { ToastContext } from "~/components/providers/ToastProvider";

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role_application: string;
  created_at: string;
}

const GET_ALL_USERS = `
  query GetAllUsers {
    users(order_by: { created_at: desc }) {
      user_id
      first_name
      last_name
      email
      role_application
      created_at
    }
  }
`;

const UPDATE_USER_ROLE = `
  mutation UpdateUserRole($user_id: uuid!, $role_application: String!) {
    update_users_by_pk(
      pk_columns: { user_id: $user_id }, 
      _set: { role_application: $role_application }
    ) {
      user_id
      role_application
    }
  }
`;

export default component$(() => {
  const filterText = useSignal("");
  const updatingUserId = useSignal<string | null>(null);
  const toast = useContext(ToastContext);
  const refreshTrigger = useSignal(0);

  const usersResource = useResource$<User[]>(async ({ track }) => {
    track(filterText);
    track(refreshTrigger);

    // We'll fetch all and filter client side for better UX on small lists
    try {
      const response = await graphqlClient.request<{ users: User[] }>(
        GET_ALL_USERS,
      );
      return response.users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  });

  const handleRoleChange = $(async (userId: string, newRole: string) => {
    updatingUserId.value = userId;
    try {
      const response = await graphqlClient.request<{
        update_users_by_pk: { user_id: string; role_application: string };
      }>(UPDATE_USER_ROLE, {
        user_id: userId,
        role_application: newRole,
      });

      if (response.update_users_by_pk) {
        toast.addToast(
          "Role updated successfully. The user must log in again to see the changes.",
          "success",
        );

        // Trigger refresh
        refreshTrigger.value++;
      } else {
        throw new Error("Could not update user");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.addToast("Error updating role", "error");
    } finally {
      updatingUserId.value = null;
    }
  });

  return (
    <div class="p-6">
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 dark:text-white">
            User Administration
          </h1>
          <p class="text-slate-500 dark:text-slate-400">
            Manage application roles for registered users
          </p>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="mb-6 flex items-center gap-4">
          <div class="relative max-w-md flex-1">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LuSearch class="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search user..."
              class="block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 pl-10 text-sm text-slate-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              bind:value={filterText}
            />
          </div>
        </div>

        <Resource
          value={usersResource}
          onPending={() => (
            <div class="flex justify-center p-8">
              <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500"></div>
            </div>
          )}
          onRejected={() => <div>Error loading users</div>}
          onResolved={(users) => {
            const filteredUsers = users.filter(
              (user) =>
                user.first_name
                  .toLowerCase()
                  .includes(filterText.value.toLowerCase()) ||
                user.last_name
                  .toLowerCase()
                  .includes(filterText.value.toLowerCase()) ||
                user.email
                  .toLowerCase()
                  .includes(filterText.value.toLowerCase()),
            );

            return (
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                  <thead class="bg-slate-50 text-xs text-slate-700 uppercase dark:bg-slate-700 dark:text-slate-400">
                    <tr>
                      <th scope="col" class="px-6 py-3">
                        User
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Email
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Application Role
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Registration Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.user_id}
                        class="border-b bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                      >
                        <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          <div class="flex items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                              {user.first_name.charAt(0)}
                              {user.last_name.charAt(0)}
                            </div>
                            <div>
                              <div class="font-semibold">
                                {user.first_name} {user.last_name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4">{user.email}</td>
                        <td class="px-6 py-4">
                          <select
                            class="block w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            value={user.role_application || "colaborador"}
                            onChange$={(e) =>
                              handleRoleChange(
                                user.user_id,
                                (e.target as HTMLSelectElement).value,
                              )
                            }
                            disabled={updatingUserId.value === user.user_id}
                          >
                            <option value="colaborador">Collaborator</option>
                            <option value="administrador">Administrator</option>
                          </select>
                          {updatingUserId.value === user.user_id && (
                            <span class="ml-2 text-xs text-blue-500">
                              Saving...
                            </span>
                          )}
                        </td>
                        <td class="px-6 py-4">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "User Administration - SIRME",
};
