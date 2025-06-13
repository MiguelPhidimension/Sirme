# Schema Types

<details>
  <summary><strong>Table of Contents</strong></summary>

  * [Query](#query)
  * [Mutation](#mutation)
  * [Subscription](#subscription)
  * [Objects](#objects)
    * [clients](#clients)
    * [clients_aggregate](#clients_aggregate)
    * [clients_aggregate_fields](#clients_aggregate_fields)
    * [clients_max_fields](#clients_max_fields)
    * [clients_min_fields](#clients_min_fields)
    * [clients_mutation_response](#clients_mutation_response)
    * [projects](#projects)
    * [projects_aggregate](#projects_aggregate)
    * [projects_aggregate_fields](#projects_aggregate_fields)
    * [projects_max_fields](#projects_max_fields)
    * [projects_min_fields](#projects_min_fields)
    * [projects_mutation_response](#projects_mutation_response)
    * [roles](#roles)
    * [roles_aggregate](#roles_aggregate)
    * [roles_aggregate_fields](#roles_aggregate_fields)
    * [roles_max_fields](#roles_max_fields)
    * [roles_min_fields](#roles_min_fields)
    * [roles_mutation_response](#roles_mutation_response)
    * [time_entries](#time_entries)
    * [time_entries_aggregate](#time_entries_aggregate)
    * [time_entries_aggregate_fields](#time_entries_aggregate_fields)
    * [time_entries_max_fields](#time_entries_max_fields)
    * [time_entries_min_fields](#time_entries_min_fields)
    * [time_entries_mutation_response](#time_entries_mutation_response)
    * [time_entry_projects](#time_entry_projects)
    * [time_entry_projects_aggregate](#time_entry_projects_aggregate)
    * [time_entry_projects_aggregate_fields](#time_entry_projects_aggregate_fields)
    * [time_entry_projects_avg_fields](#time_entry_projects_avg_fields)
    * [time_entry_projects_max_fields](#time_entry_projects_max_fields)
    * [time_entry_projects_min_fields](#time_entry_projects_min_fields)
    * [time_entry_projects_mutation_response](#time_entry_projects_mutation_response)
    * [time_entry_projects_stddev_fields](#time_entry_projects_stddev_fields)
    * [time_entry_projects_stddev_pop_fields](#time_entry_projects_stddev_pop_fields)
    * [time_entry_projects_stddev_samp_fields](#time_entry_projects_stddev_samp_fields)
    * [time_entry_projects_sum_fields](#time_entry_projects_sum_fields)
    * [time_entry_projects_var_pop_fields](#time_entry_projects_var_pop_fields)
    * [time_entry_projects_var_samp_fields](#time_entry_projects_var_samp_fields)
    * [time_entry_projects_variance_fields](#time_entry_projects_variance_fields)
    * [time_reports](#time_reports)
    * [time_reports_aggregate](#time_reports_aggregate)
    * [time_reports_aggregate_fields](#time_reports_aggregate_fields)
    * [time_reports_avg_fields](#time_reports_avg_fields)
    * [time_reports_max_fields](#time_reports_max_fields)
    * [time_reports_min_fields](#time_reports_min_fields)
    * [time_reports_mutation_response](#time_reports_mutation_response)
    * [time_reports_stddev_fields](#time_reports_stddev_fields)
    * [time_reports_stddev_pop_fields](#time_reports_stddev_pop_fields)
    * [time_reports_stddev_samp_fields](#time_reports_stddev_samp_fields)
    * [time_reports_sum_fields](#time_reports_sum_fields)
    * [time_reports_var_pop_fields](#time_reports_var_pop_fields)
    * [time_reports_var_samp_fields](#time_reports_var_samp_fields)
    * [time_reports_variance_fields](#time_reports_variance_fields)
    * [users](#users)
    * [users_aggregate](#users_aggregate)
    * [users_aggregate_fields](#users_aggregate_fields)
    * [users_max_fields](#users_max_fields)
    * [users_min_fields](#users_min_fields)
    * [users_mutation_response](#users_mutation_response)
  * [Inputs](#inputs)
    * [Boolean_comparison_exp](#boolean_comparison_exp)
    * [String_comparison_exp](#string_comparison_exp)
    * [clients_bool_exp](#clients_bool_exp)
    * [clients_insert_input](#clients_insert_input)
    * [clients_on_conflict](#clients_on_conflict)
    * [clients_order_by](#clients_order_by)
    * [clients_pk_columns_input](#clients_pk_columns_input)
    * [clients_set_input](#clients_set_input)
    * [clients_stream_cursor_input](#clients_stream_cursor_input)
    * [clients_stream_cursor_value_input](#clients_stream_cursor_value_input)
    * [clients_updates](#clients_updates)
    * [date_comparison_exp](#date_comparison_exp)
    * [numeric_comparison_exp](#numeric_comparison_exp)
    * [projects_bool_exp](#projects_bool_exp)
    * [projects_insert_input](#projects_insert_input)
    * [projects_on_conflict](#projects_on_conflict)
    * [projects_order_by](#projects_order_by)
    * [projects_pk_columns_input](#projects_pk_columns_input)
    * [projects_set_input](#projects_set_input)
    * [projects_stream_cursor_input](#projects_stream_cursor_input)
    * [projects_stream_cursor_value_input](#projects_stream_cursor_value_input)
    * [projects_updates](#projects_updates)
    * [roles_bool_exp](#roles_bool_exp)
    * [roles_insert_input](#roles_insert_input)
    * [roles_on_conflict](#roles_on_conflict)
    * [roles_order_by](#roles_order_by)
    * [roles_pk_columns_input](#roles_pk_columns_input)
    * [roles_set_input](#roles_set_input)
    * [roles_stream_cursor_input](#roles_stream_cursor_input)
    * [roles_stream_cursor_value_input](#roles_stream_cursor_value_input)
    * [roles_updates](#roles_updates)
    * [time_entries_bool_exp](#time_entries_bool_exp)
    * [time_entries_insert_input](#time_entries_insert_input)
    * [time_entries_on_conflict](#time_entries_on_conflict)
    * [time_entries_order_by](#time_entries_order_by)
    * [time_entries_pk_columns_input](#time_entries_pk_columns_input)
    * [time_entries_set_input](#time_entries_set_input)
    * [time_entries_stream_cursor_input](#time_entries_stream_cursor_input)
    * [time_entries_stream_cursor_value_input](#time_entries_stream_cursor_value_input)
    * [time_entries_updates](#time_entries_updates)
    * [time_entry_projects_bool_exp](#time_entry_projects_bool_exp)
    * [time_entry_projects_inc_input](#time_entry_projects_inc_input)
    * [time_entry_projects_insert_input](#time_entry_projects_insert_input)
    * [time_entry_projects_on_conflict](#time_entry_projects_on_conflict)
    * [time_entry_projects_order_by](#time_entry_projects_order_by)
    * [time_entry_projects_pk_columns_input](#time_entry_projects_pk_columns_input)
    * [time_entry_projects_set_input](#time_entry_projects_set_input)
    * [time_entry_projects_stream_cursor_input](#time_entry_projects_stream_cursor_input)
    * [time_entry_projects_stream_cursor_value_input](#time_entry_projects_stream_cursor_value_input)
    * [time_entry_projects_updates](#time_entry_projects_updates)
    * [time_reports_bool_exp](#time_reports_bool_exp)
    * [time_reports_inc_input](#time_reports_inc_input)
    * [time_reports_insert_input](#time_reports_insert_input)
    * [time_reports_on_conflict](#time_reports_on_conflict)
    * [time_reports_order_by](#time_reports_order_by)
    * [time_reports_pk_columns_input](#time_reports_pk_columns_input)
    * [time_reports_set_input](#time_reports_set_input)
    * [time_reports_stream_cursor_input](#time_reports_stream_cursor_input)
    * [time_reports_stream_cursor_value_input](#time_reports_stream_cursor_value_input)
    * [time_reports_updates](#time_reports_updates)
    * [timestamp_comparison_exp](#timestamp_comparison_exp)
    * [users_bool_exp](#users_bool_exp)
    * [users_insert_input](#users_insert_input)
    * [users_on_conflict](#users_on_conflict)
    * [users_order_by](#users_order_by)
    * [users_pk_columns_input](#users_pk_columns_input)
    * [users_set_input](#users_set_input)
    * [users_stream_cursor_input](#users_stream_cursor_input)
    * [users_stream_cursor_value_input](#users_stream_cursor_value_input)
    * [users_updates](#users_updates)
    * [uuid_comparison_exp](#uuid_comparison_exp)
  * [Enums](#enums)
    * [clients_constraint](#clients_constraint)
    * [clients_select_column](#clients_select_column)
    * [clients_update_column](#clients_update_column)
    * [cursor_ordering](#cursor_ordering)
    * [order_by](#order_by)
    * [projects_constraint](#projects_constraint)
    * [projects_select_column](#projects_select_column)
    * [projects_update_column](#projects_update_column)
    * [roles_constraint](#roles_constraint)
    * [roles_select_column](#roles_select_column)
    * [roles_update_column](#roles_update_column)
    * [time_entries_constraint](#time_entries_constraint)
    * [time_entries_select_column](#time_entries_select_column)
    * [time_entries_update_column](#time_entries_update_column)
    * [time_entry_projects_constraint](#time_entry_projects_constraint)
    * [time_entry_projects_select_column](#time_entry_projects_select_column)
    * [time_entry_projects_update_column](#time_entry_projects_update_column)
    * [time_reports_constraint](#time_reports_constraint)
    * [time_reports_select_column](#time_reports_select_column)
    * [time_reports_update_column](#time_reports_update_column)
    * [users_constraint](#users_constraint)
    * [users_select_column](#users_select_column)
    * [users_update_column](#users_update_column)
  * [Scalars](#scalars)
    * [Boolean](#boolean)
    * [Float](#float)
    * [Int](#int)
    * [String](#string)
    * [date](#date)
    * [numeric](#numeric)
    * [timestamp](#timestamp)
    * [uuid](#uuid)

</details>

## Query (query_root)
<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="query_root.clients">clients</strong></td>
<td valign="top">[<a href="#clients">clients</a>!]!</td>
<td>

fetch data from the table: "clients"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#clients_select_column">clients_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#clients_order_by">clients_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#clients_bool_exp">clients_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.clients_aggregate">clients_aggregate</strong></td>
<td valign="top"><a href="#clients_aggregate">clients_aggregate</a>!</td>
<td>

fetch aggregated fields from the table: "clients"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#clients_select_column">clients_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#clients_order_by">clients_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#clients_bool_exp">clients_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.clients_by_pk">clients_by_pk</strong></td>
<td valign="top"><a href="#clients">clients</a></td>
<td>

fetch data from the table: "clients" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">client_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.projects">projects</strong></td>
<td valign="top">[<a href="#projects">projects</a>!]!</td>
<td>

fetch data from the table: "projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#projects_select_column">projects_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#projects_order_by">projects_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#projects_bool_exp">projects_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.projects_aggregate">projects_aggregate</strong></td>
<td valign="top"><a href="#projects_aggregate">projects_aggregate</a>!</td>
<td>

fetch aggregated fields from the table: "projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#projects_select_column">projects_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#projects_order_by">projects_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#projects_bool_exp">projects_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.projects_by_pk">projects_by_pk</strong></td>
<td valign="top"><a href="#projects">projects</a></td>
<td>

fetch data from the table: "projects" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">project_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.roles">roles</strong></td>
<td valign="top">[<a href="#roles">roles</a>!]!</td>
<td>

fetch data from the table: "roles"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#roles_select_column">roles_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#roles_order_by">roles_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#roles_bool_exp">roles_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.roles_aggregate">roles_aggregate</strong></td>
<td valign="top"><a href="#roles_aggregate">roles_aggregate</a>!</td>
<td>

fetch aggregated fields from the table: "roles"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#roles_select_column">roles_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#roles_order_by">roles_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#roles_bool_exp">roles_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.roles_by_pk">roles_by_pk</strong></td>
<td valign="top"><a href="#roles">roles</a></td>
<td>

fetch data from the table: "roles" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">role_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.time_entries">time_entries</strong></td>
<td valign="top">[<a href="#time_entries">time_entries</a>!]!</td>
<td>

fetch data from the table: "time_entries"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#time_entries_select_column">time_entries_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#time_entries_order_by">time_entries_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_entries_bool_exp">time_entries_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.time_entries_aggregate">time_entries_aggregate</strong></td>
<td valign="top"><a href="#time_entries_aggregate">time_entries_aggregate</a>!</td>
<td>

fetch aggregated fields from the table: "time_entries"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#time_entries_select_column">time_entries_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#time_entries_order_by">time_entries_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_entries_bool_exp">time_entries_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.time_entries_by_pk">time_entries_by_pk</strong></td>
<td valign="top"><a href="#time_entries">time_entries</a></td>
<td>

fetch data from the table: "time_entries" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">time_entry_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.time_entry_projects">time_entry_projects</strong></td>
<td valign="top">[<a href="#time_entry_projects">time_entry_projects</a>!]!</td>
<td>

fetch data from the table: "time_entry_projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#time_entry_projects_select_column">time_entry_projects_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#time_entry_projects_order_by">time_entry_projects_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_entry_projects_bool_exp">time_entry_projects_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.time_entry_projects_aggregate">time_entry_projects_aggregate</strong></td>
<td valign="top"><a href="#time_entry_projects_aggregate">time_entry_projects_aggregate</a>!</td>
<td>

fetch aggregated fields from the table: "time_entry_projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#time_entry_projects_select_column">time_entry_projects_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#time_entry_projects_order_by">time_entry_projects_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_entry_projects_bool_exp">time_entry_projects_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.time_entry_projects_by_pk">time_entry_projects_by_pk</strong></td>
<td valign="top"><a href="#time_entry_projects">time_entry_projects</a></td>
<td>

fetch data from the table: "time_entry_projects" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">tep_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.time_reports">time_reports</strong></td>
<td valign="top">[<a href="#time_reports">time_reports</a>!]!</td>
<td>

fetch data from the table: "time_reports"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#time_reports_select_column">time_reports_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#time_reports_order_by">time_reports_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_reports_bool_exp">time_reports_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.time_reports_aggregate">time_reports_aggregate</strong></td>
<td valign="top"><a href="#time_reports_aggregate">time_reports_aggregate</a>!</td>
<td>

fetch aggregated fields from the table: "time_reports"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#time_reports_select_column">time_reports_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#time_reports_order_by">time_reports_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_reports_bool_exp">time_reports_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.time_reports_by_pk">time_reports_by_pk</strong></td>
<td valign="top"><a href="#time_reports">time_reports</a></td>
<td>

fetch data from the table: "time_reports" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">report_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.users">users</strong></td>
<td valign="top">[<a href="#users">users</a>!]!</td>
<td>

fetch data from the table: "users"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#users_select_column">users_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#users_order_by">users_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#users_bool_exp">users_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.users_aggregate">users_aggregate</strong></td>
<td valign="top"><a href="#users_aggregate">users_aggregate</a>!</td>
<td>

fetch aggregated fields from the table: "users"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#users_select_column">users_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#users_order_by">users_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#users_bool_exp">users_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="query_root.users_by_pk">users_by_pk</strong></td>
<td valign="top"><a href="#users">users</a></td>
<td>

fetch data from the table: "users" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">user_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
</tbody>
</table>

## Mutation (mutation_root)
mutation root

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.delete_clients">delete_clients</strong></td>
<td valign="top"><a href="#clients_mutation_response">clients_mutation_response</a></td>
<td>

delete data from the table: "clients"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#clients_bool_exp">clients_bool_exp</a>!</td>
<td>

filter the rows which have to be deleted

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.delete_clients_by_pk">delete_clients_by_pk</strong></td>
<td valign="top"><a href="#clients">clients</a></td>
<td>

delete single row from the table: "clients"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">client_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.delete_projects">delete_projects</strong></td>
<td valign="top"><a href="#projects_mutation_response">projects_mutation_response</a></td>
<td>

delete data from the table: "projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#projects_bool_exp">projects_bool_exp</a>!</td>
<td>

filter the rows which have to be deleted

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.delete_projects_by_pk">delete_projects_by_pk</strong></td>
<td valign="top"><a href="#projects">projects</a></td>
<td>

delete single row from the table: "projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">project_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.delete_roles">delete_roles</strong></td>
<td valign="top"><a href="#roles_mutation_response">roles_mutation_response</a></td>
<td>

delete data from the table: "roles"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#roles_bool_exp">roles_bool_exp</a>!</td>
<td>

filter the rows which have to be deleted

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.delete_roles_by_pk">delete_roles_by_pk</strong></td>
<td valign="top"><a href="#roles">roles</a></td>
<td>

delete single row from the table: "roles"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">role_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.delete_time_entries">delete_time_entries</strong></td>
<td valign="top"><a href="#time_entries_mutation_response">time_entries_mutation_response</a></td>
<td>

delete data from the table: "time_entries"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_entries_bool_exp">time_entries_bool_exp</a>!</td>
<td>

filter the rows which have to be deleted

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.delete_time_entries_by_pk">delete_time_entries_by_pk</strong></td>
<td valign="top"><a href="#time_entries">time_entries</a></td>
<td>

delete single row from the table: "time_entries"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">time_entry_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.delete_time_entry_projects">delete_time_entry_projects</strong></td>
<td valign="top"><a href="#time_entry_projects_mutation_response">time_entry_projects_mutation_response</a></td>
<td>

delete data from the table: "time_entry_projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_entry_projects_bool_exp">time_entry_projects_bool_exp</a>!</td>
<td>

filter the rows which have to be deleted

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.delete_time_entry_projects_by_pk">delete_time_entry_projects_by_pk</strong></td>
<td valign="top"><a href="#time_entry_projects">time_entry_projects</a></td>
<td>

delete single row from the table: "time_entry_projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">tep_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.delete_time_reports">delete_time_reports</strong></td>
<td valign="top"><a href="#time_reports_mutation_response">time_reports_mutation_response</a></td>
<td>

delete data from the table: "time_reports"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_reports_bool_exp">time_reports_bool_exp</a>!</td>
<td>

filter the rows which have to be deleted

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.delete_time_reports_by_pk">delete_time_reports_by_pk</strong></td>
<td valign="top"><a href="#time_reports">time_reports</a></td>
<td>

delete single row from the table: "time_reports"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">report_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.delete_users">delete_users</strong></td>
<td valign="top"><a href="#users_mutation_response">users_mutation_response</a></td>
<td>

delete data from the table: "users"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#users_bool_exp">users_bool_exp</a>!</td>
<td>

filter the rows which have to be deleted

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.delete_users_by_pk">delete_users_by_pk</strong></td>
<td valign="top"><a href="#users">users</a></td>
<td>

delete single row from the table: "users"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">user_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.insert_clients">insert_clients</strong></td>
<td valign="top"><a href="#clients_mutation_response">clients_mutation_response</a></td>
<td>

insert data into the table: "clients"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">objects</td>
<td valign="top">[<a href="#clients_insert_input">clients_insert_input</a>!]!</td>
<td>

the rows to be inserted

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">on_conflict</td>
<td valign="top"><a href="#clients_on_conflict">clients_on_conflict</a></td>
<td>

upsert condition

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.insert_clients_one">insert_clients_one</strong></td>
<td valign="top"><a href="#clients">clients</a></td>
<td>

insert a single row into the table: "clients"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">object</td>
<td valign="top"><a href="#clients_insert_input">clients_insert_input</a>!</td>
<td>

the row to be inserted

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">on_conflict</td>
<td valign="top"><a href="#clients_on_conflict">clients_on_conflict</a></td>
<td>

upsert condition

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.insert_projects">insert_projects</strong></td>
<td valign="top"><a href="#projects_mutation_response">projects_mutation_response</a></td>
<td>

insert data into the table: "projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">objects</td>
<td valign="top">[<a href="#projects_insert_input">projects_insert_input</a>!]!</td>
<td>

the rows to be inserted

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">on_conflict</td>
<td valign="top"><a href="#projects_on_conflict">projects_on_conflict</a></td>
<td>

upsert condition

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.insert_projects_one">insert_projects_one</strong></td>
<td valign="top"><a href="#projects">projects</a></td>
<td>

insert a single row into the table: "projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">object</td>
<td valign="top"><a href="#projects_insert_input">projects_insert_input</a>!</td>
<td>

the row to be inserted

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">on_conflict</td>
<td valign="top"><a href="#projects_on_conflict">projects_on_conflict</a></td>
<td>

upsert condition

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.insert_roles">insert_roles</strong></td>
<td valign="top"><a href="#roles_mutation_response">roles_mutation_response</a></td>
<td>

insert data into the table: "roles"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">objects</td>
<td valign="top">[<a href="#roles_insert_input">roles_insert_input</a>!]!</td>
<td>

the rows to be inserted

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">on_conflict</td>
<td valign="top"><a href="#roles_on_conflict">roles_on_conflict</a></td>
<td>

upsert condition

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.insert_roles_one">insert_roles_one</strong></td>
<td valign="top"><a href="#roles">roles</a></td>
<td>

insert a single row into the table: "roles"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">object</td>
<td valign="top"><a href="#roles_insert_input">roles_insert_input</a>!</td>
<td>

the row to be inserted

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">on_conflict</td>
<td valign="top"><a href="#roles_on_conflict">roles_on_conflict</a></td>
<td>

upsert condition

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.insert_time_entries">insert_time_entries</strong></td>
<td valign="top"><a href="#time_entries_mutation_response">time_entries_mutation_response</a></td>
<td>

insert data into the table: "time_entries"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">objects</td>
<td valign="top">[<a href="#time_entries_insert_input">time_entries_insert_input</a>!]!</td>
<td>

the rows to be inserted

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">on_conflict</td>
<td valign="top"><a href="#time_entries_on_conflict">time_entries_on_conflict</a></td>
<td>

upsert condition

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.insert_time_entries_one">insert_time_entries_one</strong></td>
<td valign="top"><a href="#time_entries">time_entries</a></td>
<td>

insert a single row into the table: "time_entries"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">object</td>
<td valign="top"><a href="#time_entries_insert_input">time_entries_insert_input</a>!</td>
<td>

the row to be inserted

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">on_conflict</td>
<td valign="top"><a href="#time_entries_on_conflict">time_entries_on_conflict</a></td>
<td>

upsert condition

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.insert_time_entry_projects">insert_time_entry_projects</strong></td>
<td valign="top"><a href="#time_entry_projects_mutation_response">time_entry_projects_mutation_response</a></td>
<td>

insert data into the table: "time_entry_projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">objects</td>
<td valign="top">[<a href="#time_entry_projects_insert_input">time_entry_projects_insert_input</a>!]!</td>
<td>

the rows to be inserted

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">on_conflict</td>
<td valign="top"><a href="#time_entry_projects_on_conflict">time_entry_projects_on_conflict</a></td>
<td>

upsert condition

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.insert_time_entry_projects_one">insert_time_entry_projects_one</strong></td>
<td valign="top"><a href="#time_entry_projects">time_entry_projects</a></td>
<td>

insert a single row into the table: "time_entry_projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">object</td>
<td valign="top"><a href="#time_entry_projects_insert_input">time_entry_projects_insert_input</a>!</td>
<td>

the row to be inserted

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">on_conflict</td>
<td valign="top"><a href="#time_entry_projects_on_conflict">time_entry_projects_on_conflict</a></td>
<td>

upsert condition

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.insert_time_reports">insert_time_reports</strong></td>
<td valign="top"><a href="#time_reports_mutation_response">time_reports_mutation_response</a></td>
<td>

insert data into the table: "time_reports"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">objects</td>
<td valign="top">[<a href="#time_reports_insert_input">time_reports_insert_input</a>!]!</td>
<td>

the rows to be inserted

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">on_conflict</td>
<td valign="top"><a href="#time_reports_on_conflict">time_reports_on_conflict</a></td>
<td>

upsert condition

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.insert_time_reports_one">insert_time_reports_one</strong></td>
<td valign="top"><a href="#time_reports">time_reports</a></td>
<td>

insert a single row into the table: "time_reports"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">object</td>
<td valign="top"><a href="#time_reports_insert_input">time_reports_insert_input</a>!</td>
<td>

the row to be inserted

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">on_conflict</td>
<td valign="top"><a href="#time_reports_on_conflict">time_reports_on_conflict</a></td>
<td>

upsert condition

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.insert_users">insert_users</strong></td>
<td valign="top"><a href="#users_mutation_response">users_mutation_response</a></td>
<td>

insert data into the table: "users"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">objects</td>
<td valign="top">[<a href="#users_insert_input">users_insert_input</a>!]!</td>
<td>

the rows to be inserted

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">on_conflict</td>
<td valign="top"><a href="#users_on_conflict">users_on_conflict</a></td>
<td>

upsert condition

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.insert_users_one">insert_users_one</strong></td>
<td valign="top"><a href="#users">users</a></td>
<td>

insert a single row into the table: "users"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">object</td>
<td valign="top"><a href="#users_insert_input">users_insert_input</a>!</td>
<td>

the row to be inserted

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">on_conflict</td>
<td valign="top"><a href="#users_on_conflict">users_on_conflict</a></td>
<td>

upsert condition

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_clients">update_clients</strong></td>
<td valign="top"><a href="#clients_mutation_response">clients_mutation_response</a></td>
<td>

update data of the table: "clients"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_set</td>
<td valign="top"><a href="#clients_set_input">clients_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#clients_bool_exp">clients_bool_exp</a>!</td>
<td>

filter the rows which have to be updated

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_clients_by_pk">update_clients_by_pk</strong></td>
<td valign="top"><a href="#clients">clients</a></td>
<td>

update single row of the table: "clients"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_set</td>
<td valign="top"><a href="#clients_set_input">clients_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">pk_columns</td>
<td valign="top"><a href="#clients_pk_columns_input">clients_pk_columns_input</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_clients_many">update_clients_many</strong></td>
<td valign="top">[<a href="#clients_mutation_response">clients_mutation_response</a>]</td>
<td>

update multiples rows of table: "clients"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">updates</td>
<td valign="top">[<a href="#clients_updates">clients_updates</a>!]!</td>
<td>

updates to execute, in order

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_projects">update_projects</strong></td>
<td valign="top"><a href="#projects_mutation_response">projects_mutation_response</a></td>
<td>

update data of the table: "projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_set</td>
<td valign="top"><a href="#projects_set_input">projects_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#projects_bool_exp">projects_bool_exp</a>!</td>
<td>

filter the rows which have to be updated

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_projects_by_pk">update_projects_by_pk</strong></td>
<td valign="top"><a href="#projects">projects</a></td>
<td>

update single row of the table: "projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_set</td>
<td valign="top"><a href="#projects_set_input">projects_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">pk_columns</td>
<td valign="top"><a href="#projects_pk_columns_input">projects_pk_columns_input</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_projects_many">update_projects_many</strong></td>
<td valign="top">[<a href="#projects_mutation_response">projects_mutation_response</a>]</td>
<td>

update multiples rows of table: "projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">updates</td>
<td valign="top">[<a href="#projects_updates">projects_updates</a>!]!</td>
<td>

updates to execute, in order

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_roles">update_roles</strong></td>
<td valign="top"><a href="#roles_mutation_response">roles_mutation_response</a></td>
<td>

update data of the table: "roles"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_set</td>
<td valign="top"><a href="#roles_set_input">roles_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#roles_bool_exp">roles_bool_exp</a>!</td>
<td>

filter the rows which have to be updated

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_roles_by_pk">update_roles_by_pk</strong></td>
<td valign="top"><a href="#roles">roles</a></td>
<td>

update single row of the table: "roles"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_set</td>
<td valign="top"><a href="#roles_set_input">roles_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">pk_columns</td>
<td valign="top"><a href="#roles_pk_columns_input">roles_pk_columns_input</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_roles_many">update_roles_many</strong></td>
<td valign="top">[<a href="#roles_mutation_response">roles_mutation_response</a>]</td>
<td>

update multiples rows of table: "roles"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">updates</td>
<td valign="top">[<a href="#roles_updates">roles_updates</a>!]!</td>
<td>

updates to execute, in order

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_time_entries">update_time_entries</strong></td>
<td valign="top"><a href="#time_entries_mutation_response">time_entries_mutation_response</a></td>
<td>

update data of the table: "time_entries"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_set</td>
<td valign="top"><a href="#time_entries_set_input">time_entries_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_entries_bool_exp">time_entries_bool_exp</a>!</td>
<td>

filter the rows which have to be updated

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_time_entries_by_pk">update_time_entries_by_pk</strong></td>
<td valign="top"><a href="#time_entries">time_entries</a></td>
<td>

update single row of the table: "time_entries"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_set</td>
<td valign="top"><a href="#time_entries_set_input">time_entries_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">pk_columns</td>
<td valign="top"><a href="#time_entries_pk_columns_input">time_entries_pk_columns_input</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_time_entries_many">update_time_entries_many</strong></td>
<td valign="top">[<a href="#time_entries_mutation_response">time_entries_mutation_response</a>]</td>
<td>

update multiples rows of table: "time_entries"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">updates</td>
<td valign="top">[<a href="#time_entries_updates">time_entries_updates</a>!]!</td>
<td>

updates to execute, in order

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_time_entry_projects">update_time_entry_projects</strong></td>
<td valign="top"><a href="#time_entry_projects_mutation_response">time_entry_projects_mutation_response</a></td>
<td>

update data of the table: "time_entry_projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_inc</td>
<td valign="top"><a href="#time_entry_projects_inc_input">time_entry_projects_inc_input</a></td>
<td>

increments the numeric columns with given value of the filtered values

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_set</td>
<td valign="top"><a href="#time_entry_projects_set_input">time_entry_projects_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_entry_projects_bool_exp">time_entry_projects_bool_exp</a>!</td>
<td>

filter the rows which have to be updated

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_time_entry_projects_by_pk">update_time_entry_projects_by_pk</strong></td>
<td valign="top"><a href="#time_entry_projects">time_entry_projects</a></td>
<td>

update single row of the table: "time_entry_projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_inc</td>
<td valign="top"><a href="#time_entry_projects_inc_input">time_entry_projects_inc_input</a></td>
<td>

increments the numeric columns with given value of the filtered values

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_set</td>
<td valign="top"><a href="#time_entry_projects_set_input">time_entry_projects_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">pk_columns</td>
<td valign="top"><a href="#time_entry_projects_pk_columns_input">time_entry_projects_pk_columns_input</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_time_entry_projects_many">update_time_entry_projects_many</strong></td>
<td valign="top">[<a href="#time_entry_projects_mutation_response">time_entry_projects_mutation_response</a>]</td>
<td>

update multiples rows of table: "time_entry_projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">updates</td>
<td valign="top">[<a href="#time_entry_projects_updates">time_entry_projects_updates</a>!]!</td>
<td>

updates to execute, in order

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_time_reports">update_time_reports</strong></td>
<td valign="top"><a href="#time_reports_mutation_response">time_reports_mutation_response</a></td>
<td>

update data of the table: "time_reports"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_inc</td>
<td valign="top"><a href="#time_reports_inc_input">time_reports_inc_input</a></td>
<td>

increments the numeric columns with given value of the filtered values

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_set</td>
<td valign="top"><a href="#time_reports_set_input">time_reports_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_reports_bool_exp">time_reports_bool_exp</a>!</td>
<td>

filter the rows which have to be updated

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_time_reports_by_pk">update_time_reports_by_pk</strong></td>
<td valign="top"><a href="#time_reports">time_reports</a></td>
<td>

update single row of the table: "time_reports"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_inc</td>
<td valign="top"><a href="#time_reports_inc_input">time_reports_inc_input</a></td>
<td>

increments the numeric columns with given value of the filtered values

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_set</td>
<td valign="top"><a href="#time_reports_set_input">time_reports_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">pk_columns</td>
<td valign="top"><a href="#time_reports_pk_columns_input">time_reports_pk_columns_input</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_time_reports_many">update_time_reports_many</strong></td>
<td valign="top">[<a href="#time_reports_mutation_response">time_reports_mutation_response</a>]</td>
<td>

update multiples rows of table: "time_reports"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">updates</td>
<td valign="top">[<a href="#time_reports_updates">time_reports_updates</a>!]!</td>
<td>

updates to execute, in order

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_users">update_users</strong></td>
<td valign="top"><a href="#users_mutation_response">users_mutation_response</a></td>
<td>

update data of the table: "users"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_set</td>
<td valign="top"><a href="#users_set_input">users_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#users_bool_exp">users_bool_exp</a>!</td>
<td>

filter the rows which have to be updated

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_users_by_pk">update_users_by_pk</strong></td>
<td valign="top"><a href="#users">users</a></td>
<td>

update single row of the table: "users"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_set</td>
<td valign="top"><a href="#users_set_input">users_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">pk_columns</td>
<td valign="top"><a href="#users_pk_columns_input">users_pk_columns_input</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="mutation_root.update_users_many">update_users_many</strong></td>
<td valign="top">[<a href="#users_mutation_response">users_mutation_response</a>]</td>
<td>

update multiples rows of table: "users"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">updates</td>
<td valign="top">[<a href="#users_updates">users_updates</a>!]!</td>
<td>

updates to execute, in order

</td>
</tr>
</tbody>
</table>

## Subscription (subscription_root)
<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.clients">clients</strong></td>
<td valign="top">[<a href="#clients">clients</a>!]!</td>
<td>

fetch data from the table: "clients"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#clients_select_column">clients_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#clients_order_by">clients_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#clients_bool_exp">clients_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.clients_aggregate">clients_aggregate</strong></td>
<td valign="top"><a href="#clients_aggregate">clients_aggregate</a>!</td>
<td>

fetch aggregated fields from the table: "clients"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#clients_select_column">clients_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#clients_order_by">clients_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#clients_bool_exp">clients_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.clients_by_pk">clients_by_pk</strong></td>
<td valign="top"><a href="#clients">clients</a></td>
<td>

fetch data from the table: "clients" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">client_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.clients_stream">clients_stream</strong></td>
<td valign="top">[<a href="#clients">clients</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "clients"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#clients_stream_cursor_input">clients_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#clients_bool_exp">clients_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.projects">projects</strong></td>
<td valign="top">[<a href="#projects">projects</a>!]!</td>
<td>

fetch data from the table: "projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#projects_select_column">projects_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#projects_order_by">projects_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#projects_bool_exp">projects_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.projects_aggregate">projects_aggregate</strong></td>
<td valign="top"><a href="#projects_aggregate">projects_aggregate</a>!</td>
<td>

fetch aggregated fields from the table: "projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#projects_select_column">projects_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#projects_order_by">projects_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#projects_bool_exp">projects_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.projects_by_pk">projects_by_pk</strong></td>
<td valign="top"><a href="#projects">projects</a></td>
<td>

fetch data from the table: "projects" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">project_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.projects_stream">projects_stream</strong></td>
<td valign="top">[<a href="#projects">projects</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#projects_stream_cursor_input">projects_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#projects_bool_exp">projects_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.roles">roles</strong></td>
<td valign="top">[<a href="#roles">roles</a>!]!</td>
<td>

fetch data from the table: "roles"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#roles_select_column">roles_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#roles_order_by">roles_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#roles_bool_exp">roles_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.roles_aggregate">roles_aggregate</strong></td>
<td valign="top"><a href="#roles_aggregate">roles_aggregate</a>!</td>
<td>

fetch aggregated fields from the table: "roles"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#roles_select_column">roles_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#roles_order_by">roles_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#roles_bool_exp">roles_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.roles_by_pk">roles_by_pk</strong></td>
<td valign="top"><a href="#roles">roles</a></td>
<td>

fetch data from the table: "roles" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">role_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.roles_stream">roles_stream</strong></td>
<td valign="top">[<a href="#roles">roles</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "roles"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#roles_stream_cursor_input">roles_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#roles_bool_exp">roles_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.time_entries">time_entries</strong></td>
<td valign="top">[<a href="#time_entries">time_entries</a>!]!</td>
<td>

fetch data from the table: "time_entries"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#time_entries_select_column">time_entries_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#time_entries_order_by">time_entries_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_entries_bool_exp">time_entries_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.time_entries_aggregate">time_entries_aggregate</strong></td>
<td valign="top"><a href="#time_entries_aggregate">time_entries_aggregate</a>!</td>
<td>

fetch aggregated fields from the table: "time_entries"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#time_entries_select_column">time_entries_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#time_entries_order_by">time_entries_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_entries_bool_exp">time_entries_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.time_entries_by_pk">time_entries_by_pk</strong></td>
<td valign="top"><a href="#time_entries">time_entries</a></td>
<td>

fetch data from the table: "time_entries" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">time_entry_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.time_entries_stream">time_entries_stream</strong></td>
<td valign="top">[<a href="#time_entries">time_entries</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "time_entries"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#time_entries_stream_cursor_input">time_entries_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_entries_bool_exp">time_entries_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.time_entry_projects">time_entry_projects</strong></td>
<td valign="top">[<a href="#time_entry_projects">time_entry_projects</a>!]!</td>
<td>

fetch data from the table: "time_entry_projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#time_entry_projects_select_column">time_entry_projects_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#time_entry_projects_order_by">time_entry_projects_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_entry_projects_bool_exp">time_entry_projects_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.time_entry_projects_aggregate">time_entry_projects_aggregate</strong></td>
<td valign="top"><a href="#time_entry_projects_aggregate">time_entry_projects_aggregate</a>!</td>
<td>

fetch aggregated fields from the table: "time_entry_projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#time_entry_projects_select_column">time_entry_projects_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#time_entry_projects_order_by">time_entry_projects_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_entry_projects_bool_exp">time_entry_projects_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.time_entry_projects_by_pk">time_entry_projects_by_pk</strong></td>
<td valign="top"><a href="#time_entry_projects">time_entry_projects</a></td>
<td>

fetch data from the table: "time_entry_projects" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">tep_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.time_entry_projects_stream">time_entry_projects_stream</strong></td>
<td valign="top">[<a href="#time_entry_projects">time_entry_projects</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "time_entry_projects"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#time_entry_projects_stream_cursor_input">time_entry_projects_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_entry_projects_bool_exp">time_entry_projects_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.time_reports">time_reports</strong></td>
<td valign="top">[<a href="#time_reports">time_reports</a>!]!</td>
<td>

fetch data from the table: "time_reports"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#time_reports_select_column">time_reports_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#time_reports_order_by">time_reports_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_reports_bool_exp">time_reports_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.time_reports_aggregate">time_reports_aggregate</strong></td>
<td valign="top"><a href="#time_reports_aggregate">time_reports_aggregate</a>!</td>
<td>

fetch aggregated fields from the table: "time_reports"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#time_reports_select_column">time_reports_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#time_reports_order_by">time_reports_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_reports_bool_exp">time_reports_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.time_reports_by_pk">time_reports_by_pk</strong></td>
<td valign="top"><a href="#time_reports">time_reports</a></td>
<td>

fetch data from the table: "time_reports" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">report_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.time_reports_stream">time_reports_stream</strong></td>
<td valign="top">[<a href="#time_reports">time_reports</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "time_reports"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#time_reports_stream_cursor_input">time_reports_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#time_reports_bool_exp">time_reports_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.users">users</strong></td>
<td valign="top">[<a href="#users">users</a>!]!</td>
<td>

fetch data from the table: "users"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#users_select_column">users_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#users_order_by">users_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#users_bool_exp">users_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.users_aggregate">users_aggregate</strong></td>
<td valign="top"><a href="#users_aggregate">users_aggregate</a>!</td>
<td>

fetch aggregated fields from the table: "users"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct_on</td>
<td valign="top">[<a href="#users_select_column">users_select_column</a>!]</td>
<td>

distinct select on columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

limit the number of rows returned

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

skip the first n rows. Use only with order_by

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top">[<a href="#users_order_by">users_order_by</a>!]</td>
<td>

sort the rows by one or more columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#users_bool_exp">users_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.users_by_pk">users_by_pk</strong></td>
<td valign="top"><a href="#users">users</a></td>
<td>

fetch data from the table: "users" using primary key columns

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">user_id</td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="subscription_root.users_stream">users_stream</strong></td>
<td valign="top">[<a href="#users">users</a>!]!</td>
<td>

fetch data from the table in a streaming manner: "users"

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">batch_size</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

maximum number of rows returned in a single batch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cursor</td>
<td valign="top">[<a href="#users_stream_cursor_input">users_stream_cursor_input</a>]!</td>
<td>

cursor to stream the results returned by the query

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">where</td>
<td valign="top"><a href="#users_bool_exp">users_bool_exp</a></td>
<td>

filter the rows returned

</td>
</tr>
</tbody>
</table>

## Objects

### clients

columns and relationships of "clients"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="clients.client_id">client_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients.name">name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### clients_aggregate

aggregated selection of "clients"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="clients_aggregate.aggregate">aggregate</strong></td>
<td valign="top"><a href="#clients_aggregate_fields">clients_aggregate_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients_aggregate.nodes">nodes</strong></td>
<td valign="top">[<a href="#clients">clients</a>!]!</td>
<td></td>
</tr>
</tbody>
</table>

### clients_aggregate_fields

aggregate fields of "clients"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="clients_aggregate_fields.count">count</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">columns</td>
<td valign="top">[<a href="#clients_select_column">clients_select_column</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct</td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients_aggregate_fields.max">max</strong></td>
<td valign="top"><a href="#clients_max_fields">clients_max_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients_aggregate_fields.min">min</strong></td>
<td valign="top"><a href="#clients_min_fields">clients_min_fields</a></td>
<td></td>
</tr>
</tbody>
</table>

### clients_max_fields

aggregate max on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="clients_max_fields.client_id">client_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients_max_fields.name">name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### clients_min_fields

aggregate min on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="clients_min_fields.client_id">client_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients_min_fields.name">name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### clients_mutation_response

response of any mutation on the table "clients"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="clients_mutation_response.affected_rows">affected_rows</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

number of rows affected by the mutation

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients_mutation_response.returning">returning</strong></td>
<td valign="top">[<a href="#clients">clients</a>!]!</td>
<td>

data from the rows affected by the mutation

</td>
</tr>
</tbody>
</table>

### projects

columns and relationships of "projects"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="projects.client_id">client_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects.description">description</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects.end_date">end_date</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects.name">name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects.start_date">start_date</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
</tbody>
</table>

### projects_aggregate

aggregated selection of "projects"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="projects_aggregate.aggregate">aggregate</strong></td>
<td valign="top"><a href="#projects_aggregate_fields">projects_aggregate_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_aggregate.nodes">nodes</strong></td>
<td valign="top">[<a href="#projects">projects</a>!]!</td>
<td></td>
</tr>
</tbody>
</table>

### projects_aggregate_fields

aggregate fields of "projects"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="projects_aggregate_fields.count">count</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">columns</td>
<td valign="top">[<a href="#projects_select_column">projects_select_column</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct</td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_aggregate_fields.max">max</strong></td>
<td valign="top"><a href="#projects_max_fields">projects_max_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_aggregate_fields.min">min</strong></td>
<td valign="top"><a href="#projects_min_fields">projects_min_fields</a></td>
<td></td>
</tr>
</tbody>
</table>

### projects_max_fields

aggregate max on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="projects_max_fields.client_id">client_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_max_fields.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_max_fields.description">description</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_max_fields.end_date">end_date</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_max_fields.name">name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_max_fields.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_max_fields.start_date">start_date</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_max_fields.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
</tbody>
</table>

### projects_min_fields

aggregate min on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="projects_min_fields.client_id">client_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_min_fields.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_min_fields.description">description</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_min_fields.end_date">end_date</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_min_fields.name">name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_min_fields.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_min_fields.start_date">start_date</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_min_fields.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
</tbody>
</table>

### projects_mutation_response

response of any mutation on the table "projects"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="projects_mutation_response.affected_rows">affected_rows</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

number of rows affected by the mutation

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_mutation_response.returning">returning</strong></td>
<td valign="top">[<a href="#projects">projects</a>!]!</td>
<td>

data from the rows affected by the mutation

</td>
</tr>
</tbody>
</table>

### roles

columns and relationships of "roles"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="roles.description">description</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles.role_id">role_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles.role_name">role_name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### roles_aggregate

aggregated selection of "roles"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="roles_aggregate.aggregate">aggregate</strong></td>
<td valign="top"><a href="#roles_aggregate_fields">roles_aggregate_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_aggregate.nodes">nodes</strong></td>
<td valign="top">[<a href="#roles">roles</a>!]!</td>
<td></td>
</tr>
</tbody>
</table>

### roles_aggregate_fields

aggregate fields of "roles"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="roles_aggregate_fields.count">count</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">columns</td>
<td valign="top">[<a href="#roles_select_column">roles_select_column</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct</td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_aggregate_fields.max">max</strong></td>
<td valign="top"><a href="#roles_max_fields">roles_max_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_aggregate_fields.min">min</strong></td>
<td valign="top"><a href="#roles_min_fields">roles_min_fields</a></td>
<td></td>
</tr>
</tbody>
</table>

### roles_max_fields

aggregate max on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="roles_max_fields.description">description</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_max_fields.role_id">role_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_max_fields.role_name">role_name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### roles_min_fields

aggregate min on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="roles_min_fields.description">description</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_min_fields.role_id">role_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_min_fields.role_name">role_name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### roles_mutation_response

response of any mutation on the table "roles"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="roles_mutation_response.affected_rows">affected_rows</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

number of rows affected by the mutation

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_mutation_response.returning">returning</strong></td>
<td valign="top">[<a href="#roles">roles</a>!]!</td>
<td>

data from the rows affected by the mutation

</td>
</tr>
</tbody>
</table>

### time_entries

columns and relationships of "time_entries"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entries.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries.entry_date">entry_date</strong></td>
<td valign="top"><a href="#date">date</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries.time_entry_id">time_entry_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### time_entries_aggregate

aggregated selection of "time_entries"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_aggregate.aggregate">aggregate</strong></td>
<td valign="top"><a href="#time_entries_aggregate_fields">time_entries_aggregate_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_aggregate.nodes">nodes</strong></td>
<td valign="top">[<a href="#time_entries">time_entries</a>!]!</td>
<td></td>
</tr>
</tbody>
</table>

### time_entries_aggregate_fields

aggregate fields of "time_entries"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_aggregate_fields.count">count</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">columns</td>
<td valign="top">[<a href="#time_entries_select_column">time_entries_select_column</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct</td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_aggregate_fields.max">max</strong></td>
<td valign="top"><a href="#time_entries_max_fields">time_entries_max_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_aggregate_fields.min">min</strong></td>
<td valign="top"><a href="#time_entries_min_fields">time_entries_min_fields</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entries_max_fields

aggregate max on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_max_fields.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_max_fields.entry_date">entry_date</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_max_fields.time_entry_id">time_entry_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_max_fields.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_max_fields.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entries_min_fields

aggregate min on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_min_fields.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_min_fields.entry_date">entry_date</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_min_fields.time_entry_id">time_entry_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_min_fields.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_min_fields.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entries_mutation_response

response of any mutation on the table "time_entries"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_mutation_response.affected_rows">affected_rows</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

number of rows affected by the mutation

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_mutation_response.returning">returning</strong></td>
<td valign="top">[<a href="#time_entries">time_entries</a>!]!</td>
<td>

data from the rows affected by the mutation

</td>
</tr>
</tbody>
</table>

### time_entry_projects

columns and relationships of "time_entry_projects"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects.hours_reported">hours_reported</strong></td>
<td valign="top"><a href="#numeric">numeric</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects.is_mps">is_mps</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects.notes">notes</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects.tep_id">tep_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects.time_entry_id">time_entry_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_aggregate

aggregated selection of "time_entry_projects"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_aggregate.aggregate">aggregate</strong></td>
<td valign="top"><a href="#time_entry_projects_aggregate_fields">time_entry_projects_aggregate_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_aggregate.nodes">nodes</strong></td>
<td valign="top">[<a href="#time_entry_projects">time_entry_projects</a>!]!</td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_aggregate_fields

aggregate fields of "time_entry_projects"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_aggregate_fields.avg">avg</strong></td>
<td valign="top"><a href="#time_entry_projects_avg_fields">time_entry_projects_avg_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_aggregate_fields.count">count</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">columns</td>
<td valign="top">[<a href="#time_entry_projects_select_column">time_entry_projects_select_column</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct</td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_aggregate_fields.max">max</strong></td>
<td valign="top"><a href="#time_entry_projects_max_fields">time_entry_projects_max_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_aggregate_fields.min">min</strong></td>
<td valign="top"><a href="#time_entry_projects_min_fields">time_entry_projects_min_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_aggregate_fields.stddev">stddev</strong></td>
<td valign="top"><a href="#time_entry_projects_stddev_fields">time_entry_projects_stddev_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_aggregate_fields.stddev_pop">stddev_pop</strong></td>
<td valign="top"><a href="#time_entry_projects_stddev_pop_fields">time_entry_projects_stddev_pop_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_aggregate_fields.stddev_samp">stddev_samp</strong></td>
<td valign="top"><a href="#time_entry_projects_stddev_samp_fields">time_entry_projects_stddev_samp_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_aggregate_fields.sum">sum</strong></td>
<td valign="top"><a href="#time_entry_projects_sum_fields">time_entry_projects_sum_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_aggregate_fields.var_pop">var_pop</strong></td>
<td valign="top"><a href="#time_entry_projects_var_pop_fields">time_entry_projects_var_pop_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_aggregate_fields.var_samp">var_samp</strong></td>
<td valign="top"><a href="#time_entry_projects_var_samp_fields">time_entry_projects_var_samp_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_aggregate_fields.variance">variance</strong></td>
<td valign="top"><a href="#time_entry_projects_variance_fields">time_entry_projects_variance_fields</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_avg_fields

aggregate avg on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_avg_fields.hours_reported">hours_reported</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_max_fields

aggregate max on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_max_fields.hours_reported">hours_reported</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_max_fields.notes">notes</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_max_fields.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_max_fields.tep_id">tep_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_max_fields.time_entry_id">time_entry_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_min_fields

aggregate min on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_min_fields.hours_reported">hours_reported</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_min_fields.notes">notes</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_min_fields.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_min_fields.tep_id">tep_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_min_fields.time_entry_id">time_entry_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_mutation_response

response of any mutation on the table "time_entry_projects"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_mutation_response.affected_rows">affected_rows</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

number of rows affected by the mutation

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_mutation_response.returning">returning</strong></td>
<td valign="top">[<a href="#time_entry_projects">time_entry_projects</a>!]!</td>
<td>

data from the rows affected by the mutation

</td>
</tr>
</tbody>
</table>

### time_entry_projects_stddev_fields

aggregate stddev on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_stddev_fields.hours_reported">hours_reported</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_stddev_pop_fields

aggregate stddev_pop on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_stddev_pop_fields.hours_reported">hours_reported</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_stddev_samp_fields

aggregate stddev_samp on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_stddev_samp_fields.hours_reported">hours_reported</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_sum_fields

aggregate sum on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_sum_fields.hours_reported">hours_reported</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_var_pop_fields

aggregate var_pop on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_var_pop_fields.hours_reported">hours_reported</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_var_samp_fields

aggregate var_samp on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_var_samp_fields.hours_reported">hours_reported</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_variance_fields

aggregate variance on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_variance_fields.hours_reported">hours_reported</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_reports

columns and relationships of "time_reports"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports.period">period</strong></td>
<td valign="top"><a href="#date">date</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports.report_id">report_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports.total_hours">total_hours</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_aggregate

aggregated selection of "time_reports"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_aggregate.aggregate">aggregate</strong></td>
<td valign="top"><a href="#time_reports_aggregate_fields">time_reports_aggregate_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_aggregate.nodes">nodes</strong></td>
<td valign="top">[<a href="#time_reports">time_reports</a>!]!</td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_aggregate_fields

aggregate fields of "time_reports"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_aggregate_fields.avg">avg</strong></td>
<td valign="top"><a href="#time_reports_avg_fields">time_reports_avg_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_aggregate_fields.count">count</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">columns</td>
<td valign="top">[<a href="#time_reports_select_column">time_reports_select_column</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct</td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_aggregate_fields.max">max</strong></td>
<td valign="top"><a href="#time_reports_max_fields">time_reports_max_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_aggregate_fields.min">min</strong></td>
<td valign="top"><a href="#time_reports_min_fields">time_reports_min_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_aggregate_fields.stddev">stddev</strong></td>
<td valign="top"><a href="#time_reports_stddev_fields">time_reports_stddev_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_aggregate_fields.stddev_pop">stddev_pop</strong></td>
<td valign="top"><a href="#time_reports_stddev_pop_fields">time_reports_stddev_pop_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_aggregate_fields.stddev_samp">stddev_samp</strong></td>
<td valign="top"><a href="#time_reports_stddev_samp_fields">time_reports_stddev_samp_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_aggregate_fields.sum">sum</strong></td>
<td valign="top"><a href="#time_reports_sum_fields">time_reports_sum_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_aggregate_fields.var_pop">var_pop</strong></td>
<td valign="top"><a href="#time_reports_var_pop_fields">time_reports_var_pop_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_aggregate_fields.var_samp">var_samp</strong></td>
<td valign="top"><a href="#time_reports_var_samp_fields">time_reports_var_samp_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_aggregate_fields.variance">variance</strong></td>
<td valign="top"><a href="#time_reports_variance_fields">time_reports_variance_fields</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_avg_fields

aggregate avg on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_avg_fields.total_hours">total_hours</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_max_fields

aggregate max on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_max_fields.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_max_fields.period">period</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_max_fields.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_max_fields.report_id">report_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_max_fields.total_hours">total_hours</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_max_fields.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_min_fields

aggregate min on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_min_fields.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_min_fields.period">period</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_min_fields.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_min_fields.report_id">report_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_min_fields.total_hours">total_hours</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_min_fields.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_mutation_response

response of any mutation on the table "time_reports"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_mutation_response.affected_rows">affected_rows</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

number of rows affected by the mutation

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_mutation_response.returning">returning</strong></td>
<td valign="top">[<a href="#time_reports">time_reports</a>!]!</td>
<td>

data from the rows affected by the mutation

</td>
</tr>
</tbody>
</table>

### time_reports_stddev_fields

aggregate stddev on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_stddev_fields.total_hours">total_hours</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_stddev_pop_fields

aggregate stddev_pop on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_stddev_pop_fields.total_hours">total_hours</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_stddev_samp_fields

aggregate stddev_samp on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_stddev_samp_fields.total_hours">total_hours</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_sum_fields

aggregate sum on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_sum_fields.total_hours">total_hours</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_var_pop_fields

aggregate var_pop on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_var_pop_fields.total_hours">total_hours</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_var_samp_fields

aggregate var_samp on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_var_samp_fields.total_hours">total_hours</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_variance_fields

aggregate variance on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_variance_fields.total_hours">total_hours</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
</tbody>
</table>

### users

columns and relationships of "users"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="users.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users.email">email</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users.first_name">first_name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users.last_name">last_name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users.password">password</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users.role_id">role_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### users_aggregate

aggregated selection of "users"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="users_aggregate.aggregate">aggregate</strong></td>
<td valign="top"><a href="#users_aggregate_fields">users_aggregate_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_aggregate.nodes">nodes</strong></td>
<td valign="top">[<a href="#users">users</a>!]!</td>
<td></td>
</tr>
</tbody>
</table>

### users_aggregate_fields

aggregate fields of "users"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="users_aggregate_fields.count">count</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">columns</td>
<td valign="top">[<a href="#users_select_column">users_select_column</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">distinct</td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_aggregate_fields.max">max</strong></td>
<td valign="top"><a href="#users_max_fields">users_max_fields</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_aggregate_fields.min">min</strong></td>
<td valign="top"><a href="#users_min_fields">users_min_fields</a></td>
<td></td>
</tr>
</tbody>
</table>

### users_max_fields

aggregate max on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="users_max_fields.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_max_fields.email">email</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_max_fields.first_name">first_name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_max_fields.last_name">last_name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_max_fields.password">password</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_max_fields.role_id">role_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_max_fields.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_max_fields.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### users_min_fields

aggregate min on columns

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="users_min_fields.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_min_fields.email">email</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_min_fields.first_name">first_name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_min_fields.last_name">last_name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_min_fields.password">password</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_min_fields.role_id">role_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_min_fields.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_min_fields.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### users_mutation_response

response of any mutation on the table "users"

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="users_mutation_response.affected_rows">affected_rows</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

number of rows affected by the mutation

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_mutation_response.returning">returning</strong></td>
<td valign="top">[<a href="#users">users</a>!]!</td>
<td>

data from the rows affected by the mutation

</td>
</tr>
</tbody>
</table>

## Inputs

### Boolean_comparison_exp

Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="boolean_comparison_exp._eq">_eq</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="boolean_comparison_exp._gt">_gt</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="boolean_comparison_exp._gte">_gte</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="boolean_comparison_exp._in">_in</strong></td>
<td valign="top">[<a href="#boolean">Boolean</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="boolean_comparison_exp._is_null">_is_null</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="boolean_comparison_exp._lt">_lt</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="boolean_comparison_exp._lte">_lte</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="boolean_comparison_exp._neq">_neq</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="boolean_comparison_exp._nin">_nin</strong></td>
<td valign="top">[<a href="#boolean">Boolean</a>!]</td>
<td></td>
</tr>
</tbody>
</table>

### String_comparison_exp

Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._eq">_eq</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._gt">_gt</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._gte">_gte</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._ilike">_ilike</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column match the given case-insensitive pattern

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._in">_in</strong></td>
<td valign="top">[<a href="#string">String</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._iregex">_iregex</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column match the given POSIX regular expression, case insensitive

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._is_null">_is_null</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._like">_like</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column match the given pattern

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._lt">_lt</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._lte">_lte</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._neq">_neq</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._nilike">_nilike</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column NOT match the given case-insensitive pattern

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._nin">_nin</strong></td>
<td valign="top">[<a href="#string">String</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._niregex">_niregex</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column NOT match the given POSIX regular expression, case insensitive

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._nlike">_nlike</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column NOT match the given pattern

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._nregex">_nregex</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column NOT match the given POSIX regular expression, case sensitive

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._nsimilar">_nsimilar</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column NOT match the given SQL regular expression

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._regex">_regex</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column match the given POSIX regular expression, case sensitive

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="string_comparison_exp._similar">_similar</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

does the column match the given SQL regular expression

</td>
</tr>
</tbody>
</table>

### clients_bool_exp

Boolean expression to filter rows from the table "clients". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="clients_bool_exp._and">_and</strong></td>
<td valign="top">[<a href="#clients_bool_exp">clients_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients_bool_exp._not">_not</strong></td>
<td valign="top"><a href="#clients_bool_exp">clients_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients_bool_exp._or">_or</strong></td>
<td valign="top">[<a href="#clients_bool_exp">clients_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients_bool_exp.client_id">client_id</strong></td>
<td valign="top"><a href="#uuid_comparison_exp">uuid_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients_bool_exp.name">name</strong></td>
<td valign="top"><a href="#string_comparison_exp">String_comparison_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### clients_insert_input

input type for inserting data into table "clients"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="clients_insert_input.client_id">client_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients_insert_input.name">name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### clients_on_conflict

on_conflict condition type for table "clients"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="clients_on_conflict.constraint">constraint</strong></td>
<td valign="top"><a href="#clients_constraint">clients_constraint</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients_on_conflict.update_columns">update_columns</strong></td>
<td valign="top">[<a href="#clients_update_column">clients_update_column</a>!]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients_on_conflict.where">where</strong></td>
<td valign="top"><a href="#clients_bool_exp">clients_bool_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### clients_order_by

Ordering options when selecting data from "clients".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="clients_order_by.client_id">client_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients_order_by.name">name</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### clients_pk_columns_input

primary key columns input for table: clients

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="clients_pk_columns_input.client_id">client_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### clients_set_input

input type for updating data in table "clients"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="clients_set_input.client_id">client_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients_set_input.name">name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### clients_stream_cursor_input

Streaming cursor of the table "clients"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="clients_stream_cursor_input.initial_value">initial_value</strong></td>
<td valign="top"><a href="#clients_stream_cursor_value_input">clients_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients_stream_cursor_input.ordering">ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### clients_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="clients_stream_cursor_value_input.client_id">client_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients_stream_cursor_value_input.name">name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### clients_updates

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="clients_updates._set">_set</strong></td>
<td valign="top"><a href="#clients_set_input">clients_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="clients_updates.where">where</strong></td>
<td valign="top"><a href="#clients_bool_exp">clients_bool_exp</a>!</td>
<td>

filter the rows which have to be updated

</td>
</tr>
</tbody>
</table>

### date_comparison_exp

Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="date_comparison_exp._eq">_eq</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="date_comparison_exp._gt">_gt</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="date_comparison_exp._gte">_gte</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="date_comparison_exp._in">_in</strong></td>
<td valign="top">[<a href="#date">date</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="date_comparison_exp._is_null">_is_null</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="date_comparison_exp._lt">_lt</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="date_comparison_exp._lte">_lte</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="date_comparison_exp._neq">_neq</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="date_comparison_exp._nin">_nin</strong></td>
<td valign="top">[<a href="#date">date</a>!]</td>
<td></td>
</tr>
</tbody>
</table>

### numeric_comparison_exp

Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="numeric_comparison_exp._eq">_eq</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="numeric_comparison_exp._gt">_gt</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="numeric_comparison_exp._gte">_gte</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="numeric_comparison_exp._in">_in</strong></td>
<td valign="top">[<a href="#numeric">numeric</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="numeric_comparison_exp._is_null">_is_null</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="numeric_comparison_exp._lt">_lt</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="numeric_comparison_exp._lte">_lte</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="numeric_comparison_exp._neq">_neq</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="numeric_comparison_exp._nin">_nin</strong></td>
<td valign="top">[<a href="#numeric">numeric</a>!]</td>
<td></td>
</tr>
</tbody>
</table>

### projects_bool_exp

Boolean expression to filter rows from the table "projects". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="projects_bool_exp._and">_and</strong></td>
<td valign="top">[<a href="#projects_bool_exp">projects_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_bool_exp._not">_not</strong></td>
<td valign="top"><a href="#projects_bool_exp">projects_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_bool_exp._or">_or</strong></td>
<td valign="top">[<a href="#projects_bool_exp">projects_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_bool_exp.client_id">client_id</strong></td>
<td valign="top"><a href="#uuid_comparison_exp">uuid_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_bool_exp.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp_comparison_exp">timestamp_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_bool_exp.description">description</strong></td>
<td valign="top"><a href="#string_comparison_exp">String_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_bool_exp.end_date">end_date</strong></td>
<td valign="top"><a href="#date_comparison_exp">date_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_bool_exp.name">name</strong></td>
<td valign="top"><a href="#string_comparison_exp">String_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_bool_exp.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid_comparison_exp">uuid_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_bool_exp.start_date">start_date</strong></td>
<td valign="top"><a href="#date_comparison_exp">date_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_bool_exp.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp_comparison_exp">timestamp_comparison_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### projects_insert_input

input type for inserting data into table "projects"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="projects_insert_input.client_id">client_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_insert_input.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_insert_input.description">description</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_insert_input.end_date">end_date</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_insert_input.name">name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_insert_input.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_insert_input.start_date">start_date</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_insert_input.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
</tbody>
</table>

### projects_on_conflict

on_conflict condition type for table "projects"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="projects_on_conflict.constraint">constraint</strong></td>
<td valign="top"><a href="#projects_constraint">projects_constraint</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_on_conflict.update_columns">update_columns</strong></td>
<td valign="top">[<a href="#projects_update_column">projects_update_column</a>!]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_on_conflict.where">where</strong></td>
<td valign="top"><a href="#projects_bool_exp">projects_bool_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### projects_order_by

Ordering options when selecting data from "projects".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="projects_order_by.client_id">client_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_order_by.created_at">created_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_order_by.description">description</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_order_by.end_date">end_date</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_order_by.name">name</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_order_by.project_id">project_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_order_by.start_date">start_date</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_order_by.updated_at">updated_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### projects_pk_columns_input

primary key columns input for table: projects

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="projects_pk_columns_input.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### projects_set_input

input type for updating data in table "projects"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="projects_set_input.client_id">client_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_set_input.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_set_input.description">description</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_set_input.end_date">end_date</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_set_input.name">name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_set_input.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_set_input.start_date">start_date</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_set_input.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
</tbody>
</table>

### projects_stream_cursor_input

Streaming cursor of the table "projects"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="projects_stream_cursor_input.initial_value">initial_value</strong></td>
<td valign="top"><a href="#projects_stream_cursor_value_input">projects_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_stream_cursor_input.ordering">ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### projects_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="projects_stream_cursor_value_input.client_id">client_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_stream_cursor_value_input.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_stream_cursor_value_input.description">description</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_stream_cursor_value_input.end_date">end_date</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_stream_cursor_value_input.name">name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_stream_cursor_value_input.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_stream_cursor_value_input.start_date">start_date</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_stream_cursor_value_input.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
</tbody>
</table>

### projects_updates

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="projects_updates._set">_set</strong></td>
<td valign="top"><a href="#projects_set_input">projects_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="projects_updates.where">where</strong></td>
<td valign="top"><a href="#projects_bool_exp">projects_bool_exp</a>!</td>
<td>

filter the rows which have to be updated

</td>
</tr>
</tbody>
</table>

### roles_bool_exp

Boolean expression to filter rows from the table "roles". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="roles_bool_exp._and">_and</strong></td>
<td valign="top">[<a href="#roles_bool_exp">roles_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_bool_exp._not">_not</strong></td>
<td valign="top"><a href="#roles_bool_exp">roles_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_bool_exp._or">_or</strong></td>
<td valign="top">[<a href="#roles_bool_exp">roles_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_bool_exp.description">description</strong></td>
<td valign="top"><a href="#string_comparison_exp">String_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_bool_exp.role_id">role_id</strong></td>
<td valign="top"><a href="#uuid_comparison_exp">uuid_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_bool_exp.role_name">role_name</strong></td>
<td valign="top"><a href="#string_comparison_exp">String_comparison_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### roles_insert_input

input type for inserting data into table "roles"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="roles_insert_input.description">description</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_insert_input.role_id">role_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_insert_input.role_name">role_name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### roles_on_conflict

on_conflict condition type for table "roles"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="roles_on_conflict.constraint">constraint</strong></td>
<td valign="top"><a href="#roles_constraint">roles_constraint</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_on_conflict.update_columns">update_columns</strong></td>
<td valign="top">[<a href="#roles_update_column">roles_update_column</a>!]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_on_conflict.where">where</strong></td>
<td valign="top"><a href="#roles_bool_exp">roles_bool_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### roles_order_by

Ordering options when selecting data from "roles".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="roles_order_by.description">description</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_order_by.role_id">role_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_order_by.role_name">role_name</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### roles_pk_columns_input

primary key columns input for table: roles

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="roles_pk_columns_input.role_id">role_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### roles_set_input

input type for updating data in table "roles"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="roles_set_input.description">description</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_set_input.role_id">role_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_set_input.role_name">role_name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### roles_stream_cursor_input

Streaming cursor of the table "roles"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="roles_stream_cursor_input.initial_value">initial_value</strong></td>
<td valign="top"><a href="#roles_stream_cursor_value_input">roles_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_stream_cursor_input.ordering">ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### roles_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="roles_stream_cursor_value_input.description">description</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_stream_cursor_value_input.role_id">role_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_stream_cursor_value_input.role_name">role_name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### roles_updates

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="roles_updates._set">_set</strong></td>
<td valign="top"><a href="#roles_set_input">roles_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="roles_updates.where">where</strong></td>
<td valign="top"><a href="#roles_bool_exp">roles_bool_exp</a>!</td>
<td>

filter the rows which have to be updated

</td>
</tr>
</tbody>
</table>

### time_entries_bool_exp

Boolean expression to filter rows from the table "time_entries". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_bool_exp._and">_and</strong></td>
<td valign="top">[<a href="#time_entries_bool_exp">time_entries_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_bool_exp._not">_not</strong></td>
<td valign="top"><a href="#time_entries_bool_exp">time_entries_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_bool_exp._or">_or</strong></td>
<td valign="top">[<a href="#time_entries_bool_exp">time_entries_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_bool_exp.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp_comparison_exp">timestamp_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_bool_exp.entry_date">entry_date</strong></td>
<td valign="top"><a href="#date_comparison_exp">date_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_bool_exp.time_entry_id">time_entry_id</strong></td>
<td valign="top"><a href="#uuid_comparison_exp">uuid_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_bool_exp.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp_comparison_exp">timestamp_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_bool_exp.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid_comparison_exp">uuid_comparison_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entries_insert_input

input type for inserting data into table "time_entries"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_insert_input.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_insert_input.entry_date">entry_date</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_insert_input.time_entry_id">time_entry_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_insert_input.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_insert_input.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entries_on_conflict

on_conflict condition type for table "time_entries"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_on_conflict.constraint">constraint</strong></td>
<td valign="top"><a href="#time_entries_constraint">time_entries_constraint</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_on_conflict.update_columns">update_columns</strong></td>
<td valign="top">[<a href="#time_entries_update_column">time_entries_update_column</a>!]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_on_conflict.where">where</strong></td>
<td valign="top"><a href="#time_entries_bool_exp">time_entries_bool_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entries_order_by

Ordering options when selecting data from "time_entries".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_order_by.created_at">created_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_order_by.entry_date">entry_date</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_order_by.time_entry_id">time_entry_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_order_by.updated_at">updated_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_order_by.user_id">user_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entries_pk_columns_input

primary key columns input for table: time_entries

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_pk_columns_input.time_entry_id">time_entry_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### time_entries_set_input

input type for updating data in table "time_entries"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_set_input.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_set_input.entry_date">entry_date</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_set_input.time_entry_id">time_entry_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_set_input.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_set_input.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entries_stream_cursor_input

Streaming cursor of the table "time_entries"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_stream_cursor_input.initial_value">initial_value</strong></td>
<td valign="top"><a href="#time_entries_stream_cursor_value_input">time_entries_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_stream_cursor_input.ordering">ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### time_entries_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_stream_cursor_value_input.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_stream_cursor_value_input.entry_date">entry_date</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_stream_cursor_value_input.time_entry_id">time_entry_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_stream_cursor_value_input.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_stream_cursor_value_input.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entries_updates

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_updates._set">_set</strong></td>
<td valign="top"><a href="#time_entries_set_input">time_entries_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entries_updates.where">where</strong></td>
<td valign="top"><a href="#time_entries_bool_exp">time_entries_bool_exp</a>!</td>
<td>

filter the rows which have to be updated

</td>
</tr>
</tbody>
</table>

### time_entry_projects_bool_exp

Boolean expression to filter rows from the table "time_entry_projects". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_bool_exp._and">_and</strong></td>
<td valign="top">[<a href="#time_entry_projects_bool_exp">time_entry_projects_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_bool_exp._not">_not</strong></td>
<td valign="top"><a href="#time_entry_projects_bool_exp">time_entry_projects_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_bool_exp._or">_or</strong></td>
<td valign="top">[<a href="#time_entry_projects_bool_exp">time_entry_projects_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_bool_exp.hours_reported">hours_reported</strong></td>
<td valign="top"><a href="#numeric_comparison_exp">numeric_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_bool_exp.is_mps">is_mps</strong></td>
<td valign="top"><a href="#boolean_comparison_exp">Boolean_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_bool_exp.notes">notes</strong></td>
<td valign="top"><a href="#string_comparison_exp">String_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_bool_exp.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid_comparison_exp">uuid_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_bool_exp.tep_id">tep_id</strong></td>
<td valign="top"><a href="#uuid_comparison_exp">uuid_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_bool_exp.time_entry_id">time_entry_id</strong></td>
<td valign="top"><a href="#uuid_comparison_exp">uuid_comparison_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_inc_input

input type for incrementing numeric columns in table "time_entry_projects"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_inc_input.hours_reported">hours_reported</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_insert_input

input type for inserting data into table "time_entry_projects"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_insert_input.hours_reported">hours_reported</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_insert_input.is_mps">is_mps</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_insert_input.notes">notes</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_insert_input.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_insert_input.tep_id">tep_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_insert_input.time_entry_id">time_entry_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_on_conflict

on_conflict condition type for table "time_entry_projects"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_on_conflict.constraint">constraint</strong></td>
<td valign="top"><a href="#time_entry_projects_constraint">time_entry_projects_constraint</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_on_conflict.update_columns">update_columns</strong></td>
<td valign="top">[<a href="#time_entry_projects_update_column">time_entry_projects_update_column</a>!]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_on_conflict.where">where</strong></td>
<td valign="top"><a href="#time_entry_projects_bool_exp">time_entry_projects_bool_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_order_by

Ordering options when selecting data from "time_entry_projects".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_order_by.hours_reported">hours_reported</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_order_by.is_mps">is_mps</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_order_by.notes">notes</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_order_by.project_id">project_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_order_by.tep_id">tep_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_order_by.time_entry_id">time_entry_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_pk_columns_input

primary key columns input for table: time_entry_projects

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_pk_columns_input.tep_id">tep_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_set_input

input type for updating data in table "time_entry_projects"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_set_input.hours_reported">hours_reported</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_set_input.is_mps">is_mps</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_set_input.notes">notes</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_set_input.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_set_input.tep_id">tep_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_set_input.time_entry_id">time_entry_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_stream_cursor_input

Streaming cursor of the table "time_entry_projects"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_stream_cursor_input.initial_value">initial_value</strong></td>
<td valign="top"><a href="#time_entry_projects_stream_cursor_value_input">time_entry_projects_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_stream_cursor_input.ordering">ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### time_entry_projects_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_stream_cursor_value_input.hours_reported">hours_reported</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_stream_cursor_value_input.is_mps">is_mps</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_stream_cursor_value_input.notes">notes</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_stream_cursor_value_input.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_stream_cursor_value_input.tep_id">tep_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_stream_cursor_value_input.time_entry_id">time_entry_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_entry_projects_updates

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_updates._inc">_inc</strong></td>
<td valign="top"><a href="#time_entry_projects_inc_input">time_entry_projects_inc_input</a></td>
<td>

increments the numeric columns with given value of the filtered values

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_updates._set">_set</strong></td>
<td valign="top"><a href="#time_entry_projects_set_input">time_entry_projects_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_entry_projects_updates.where">where</strong></td>
<td valign="top"><a href="#time_entry_projects_bool_exp">time_entry_projects_bool_exp</a>!</td>
<td>

filter the rows which have to be updated

</td>
</tr>
</tbody>
</table>

### time_reports_bool_exp

Boolean expression to filter rows from the table "time_reports". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_bool_exp._and">_and</strong></td>
<td valign="top">[<a href="#time_reports_bool_exp">time_reports_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_bool_exp._not">_not</strong></td>
<td valign="top"><a href="#time_reports_bool_exp">time_reports_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_bool_exp._or">_or</strong></td>
<td valign="top">[<a href="#time_reports_bool_exp">time_reports_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_bool_exp.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp_comparison_exp">timestamp_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_bool_exp.period">period</strong></td>
<td valign="top"><a href="#date_comparison_exp">date_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_bool_exp.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid_comparison_exp">uuid_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_bool_exp.report_id">report_id</strong></td>
<td valign="top"><a href="#uuid_comparison_exp">uuid_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_bool_exp.total_hours">total_hours</strong></td>
<td valign="top"><a href="#numeric_comparison_exp">numeric_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_bool_exp.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid_comparison_exp">uuid_comparison_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_inc_input

input type for incrementing numeric columns in table "time_reports"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_inc_input.total_hours">total_hours</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_insert_input

input type for inserting data into table "time_reports"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_insert_input.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_insert_input.period">period</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_insert_input.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_insert_input.report_id">report_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_insert_input.total_hours">total_hours</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_insert_input.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_on_conflict

on_conflict condition type for table "time_reports"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_on_conflict.constraint">constraint</strong></td>
<td valign="top"><a href="#time_reports_constraint">time_reports_constraint</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_on_conflict.update_columns">update_columns</strong></td>
<td valign="top">[<a href="#time_reports_update_column">time_reports_update_column</a>!]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_on_conflict.where">where</strong></td>
<td valign="top"><a href="#time_reports_bool_exp">time_reports_bool_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_order_by

Ordering options when selecting data from "time_reports".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_order_by.created_at">created_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_order_by.period">period</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_order_by.project_id">project_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_order_by.report_id">report_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_order_by.total_hours">total_hours</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_order_by.user_id">user_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_pk_columns_input

primary key columns input for table: time_reports

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_pk_columns_input.report_id">report_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_set_input

input type for updating data in table "time_reports"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_set_input.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_set_input.period">period</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_set_input.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_set_input.report_id">report_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_set_input.total_hours">total_hours</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_set_input.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_stream_cursor_input

Streaming cursor of the table "time_reports"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_stream_cursor_input.initial_value">initial_value</strong></td>
<td valign="top"><a href="#time_reports_stream_cursor_value_input">time_reports_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_stream_cursor_input.ordering">ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### time_reports_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_stream_cursor_value_input.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_stream_cursor_value_input.period">period</strong></td>
<td valign="top"><a href="#date">date</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_stream_cursor_value_input.project_id">project_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_stream_cursor_value_input.report_id">report_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_stream_cursor_value_input.total_hours">total_hours</strong></td>
<td valign="top"><a href="#numeric">numeric</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_stream_cursor_value_input.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### time_reports_updates

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_updates._inc">_inc</strong></td>
<td valign="top"><a href="#time_reports_inc_input">time_reports_inc_input</a></td>
<td>

increments the numeric columns with given value of the filtered values

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_updates._set">_set</strong></td>
<td valign="top"><a href="#time_reports_set_input">time_reports_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="time_reports_updates.where">where</strong></td>
<td valign="top"><a href="#time_reports_bool_exp">time_reports_bool_exp</a>!</td>
<td>

filter the rows which have to be updated

</td>
</tr>
</tbody>
</table>

### timestamp_comparison_exp

Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="timestamp_comparison_exp._eq">_eq</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="timestamp_comparison_exp._gt">_gt</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="timestamp_comparison_exp._gte">_gte</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="timestamp_comparison_exp._in">_in</strong></td>
<td valign="top">[<a href="#timestamp">timestamp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="timestamp_comparison_exp._is_null">_is_null</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="timestamp_comparison_exp._lt">_lt</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="timestamp_comparison_exp._lte">_lte</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="timestamp_comparison_exp._neq">_neq</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="timestamp_comparison_exp._nin">_nin</strong></td>
<td valign="top">[<a href="#timestamp">timestamp</a>!]</td>
<td></td>
</tr>
</tbody>
</table>

### users_bool_exp

Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="users_bool_exp._and">_and</strong></td>
<td valign="top">[<a href="#users_bool_exp">users_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_bool_exp._not">_not</strong></td>
<td valign="top"><a href="#users_bool_exp">users_bool_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_bool_exp._or">_or</strong></td>
<td valign="top">[<a href="#users_bool_exp">users_bool_exp</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_bool_exp.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp_comparison_exp">timestamp_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_bool_exp.email">email</strong></td>
<td valign="top"><a href="#string_comparison_exp">String_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_bool_exp.first_name">first_name</strong></td>
<td valign="top"><a href="#string_comparison_exp">String_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_bool_exp.last_name">last_name</strong></td>
<td valign="top"><a href="#string_comparison_exp">String_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_bool_exp.password">password</strong></td>
<td valign="top"><a href="#string_comparison_exp">String_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_bool_exp.role_id">role_id</strong></td>
<td valign="top"><a href="#uuid_comparison_exp">uuid_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_bool_exp.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp_comparison_exp">timestamp_comparison_exp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_bool_exp.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid_comparison_exp">uuid_comparison_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### users_insert_input

input type for inserting data into table "users"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="users_insert_input.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_insert_input.email">email</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_insert_input.first_name">first_name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_insert_input.last_name">last_name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_insert_input.password">password</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_insert_input.role_id">role_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_insert_input.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_insert_input.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### users_on_conflict

on_conflict condition type for table "users"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="users_on_conflict.constraint">constraint</strong></td>
<td valign="top"><a href="#users_constraint">users_constraint</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_on_conflict.update_columns">update_columns</strong></td>
<td valign="top">[<a href="#users_update_column">users_update_column</a>!]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_on_conflict.where">where</strong></td>
<td valign="top"><a href="#users_bool_exp">users_bool_exp</a></td>
<td></td>
</tr>
</tbody>
</table>

### users_order_by

Ordering options when selecting data from "users".

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="users_order_by.created_at">created_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_order_by.email">email</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_order_by.first_name">first_name</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_order_by.last_name">last_name</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_order_by.password">password</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_order_by.role_id">role_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_order_by.updated_at">updated_at</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_order_by.user_id">user_id</strong></td>
<td valign="top"><a href="#order_by">order_by</a></td>
<td></td>
</tr>
</tbody>
</table>

### users_pk_columns_input

primary key columns input for table: users

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="users_pk_columns_input.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### users_set_input

input type for updating data in table "users"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="users_set_input.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_set_input.email">email</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_set_input.first_name">first_name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_set_input.last_name">last_name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_set_input.password">password</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_set_input.role_id">role_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_set_input.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_set_input.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### users_stream_cursor_input

Streaming cursor of the table "users"

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="users_stream_cursor_input.initial_value">initial_value</strong></td>
<td valign="top"><a href="#users_stream_cursor_value_input">users_stream_cursor_value_input</a>!</td>
<td>

Stream column input with initial value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_stream_cursor_input.ordering">ordering</strong></td>
<td valign="top"><a href="#cursor_ordering">cursor_ordering</a></td>
<td>

cursor ordering

</td>
</tr>
</tbody>
</table>

### users_stream_cursor_value_input

Initial value of the column from where the streaming should start

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="users_stream_cursor_value_input.created_at">created_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_stream_cursor_value_input.email">email</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_stream_cursor_value_input.first_name">first_name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_stream_cursor_value_input.last_name">last_name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_stream_cursor_value_input.password">password</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_stream_cursor_value_input.role_id">role_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_stream_cursor_value_input.updated_at">updated_at</strong></td>
<td valign="top"><a href="#timestamp">timestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_stream_cursor_value_input.user_id">user_id</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
</tbody>
</table>

### users_updates

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="users_updates._set">_set</strong></td>
<td valign="top"><a href="#users_set_input">users_set_input</a></td>
<td>

sets the columns of the filtered rows to the given values

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="users_updates.where">where</strong></td>
<td valign="top"><a href="#users_bool_exp">users_bool_exp</a>!</td>
<td>

filter the rows which have to be updated

</td>
</tr>
</tbody>
</table>

### uuid_comparison_exp

Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong id="uuid_comparison_exp._eq">_eq</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="uuid_comparison_exp._gt">_gt</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="uuid_comparison_exp._gte">_gte</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="uuid_comparison_exp._in">_in</strong></td>
<td valign="top">[<a href="#uuid">uuid</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="uuid_comparison_exp._is_null">_is_null</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="uuid_comparison_exp._lt">_lt</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="uuid_comparison_exp._lte">_lte</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="uuid_comparison_exp._neq">_neq</strong></td>
<td valign="top"><a href="#uuid">uuid</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong id="uuid_comparison_exp._nin">_nin</strong></td>
<td valign="top">[<a href="#uuid">uuid</a>!]</td>
<td></td>
</tr>
</tbody>
</table>

## Enums

### clients_constraint

unique or primary key constraints on table "clients"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>clients_pkey</strong></td>
<td>

unique or primary key constraint on columns "client_id"

</td>
</tr>
</tbody>
</table>

### clients_select_column

select columns of table "clients"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>client_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>name</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### clients_update_column

update columns of table "clients"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>client_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>name</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### cursor_ordering

ordering argument of a cursor

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>ASC</strong></td>
<td>

ascending ordering of the cursor

</td>
</tr>
<tr>
<td valign="top"><strong>DESC</strong></td>
<td>

descending ordering of the cursor

</td>
</tr>
</tbody>
</table>

### order_by

column ordering options

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>asc</strong></td>
<td>

in ascending order, nulls last

</td>
</tr>
<tr>
<td valign="top"><strong>asc_nulls_first</strong></td>
<td>

in ascending order, nulls first

</td>
</tr>
<tr>
<td valign="top"><strong>asc_nulls_last</strong></td>
<td>

in ascending order, nulls last

</td>
</tr>
<tr>
<td valign="top"><strong>desc</strong></td>
<td>

in descending order, nulls first

</td>
</tr>
<tr>
<td valign="top"><strong>desc_nulls_first</strong></td>
<td>

in descending order, nulls first

</td>
</tr>
<tr>
<td valign="top"><strong>desc_nulls_last</strong></td>
<td>

in descending order, nulls last

</td>
</tr>
</tbody>
</table>

### projects_constraint

unique or primary key constraints on table "projects"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>projects_pkey</strong></td>
<td>

unique or primary key constraint on columns "project_id"

</td>
</tr>
</tbody>
</table>

### projects_select_column

select columns of table "projects"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>client_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>created_at</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>description</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>end_date</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>name</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>project_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>start_date</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>updated_at</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### projects_update_column

update columns of table "projects"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>client_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>created_at</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>description</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>end_date</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>name</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>project_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>start_date</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>updated_at</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### roles_constraint

unique or primary key constraints on table "roles"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>roles_pkey</strong></td>
<td>

unique or primary key constraint on columns "role_id"

</td>
</tr>
<tr>
<td valign="top"><strong>roles_role_name_key</strong></td>
<td>

unique or primary key constraint on columns "role_name"

</td>
</tr>
</tbody>
</table>

### roles_select_column

select columns of table "roles"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>description</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>role_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>role_name</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### roles_update_column

update columns of table "roles"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>description</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>role_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>role_name</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### time_entries_constraint

unique or primary key constraints on table "time_entries"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>time_entries_pkey</strong></td>
<td>

unique or primary key constraint on columns "time_entry_id"

</td>
</tr>
</tbody>
</table>

### time_entries_select_column

select columns of table "time_entries"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>created_at</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>entry_date</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>time_entry_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>updated_at</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>user_id</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### time_entries_update_column

update columns of table "time_entries"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>created_at</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>entry_date</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>time_entry_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>updated_at</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>user_id</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### time_entry_projects_constraint

unique or primary key constraints on table "time_entry_projects"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>time_entry_projects_pkey</strong></td>
<td>

unique or primary key constraint on columns "tep_id"

</td>
</tr>
</tbody>
</table>

### time_entry_projects_select_column

select columns of table "time_entry_projects"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>hours_reported</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>is_mps</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>notes</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>project_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>tep_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>time_entry_id</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### time_entry_projects_update_column

update columns of table "time_entry_projects"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>hours_reported</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>is_mps</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>notes</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>project_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>tep_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>time_entry_id</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### time_reports_constraint

unique or primary key constraints on table "time_reports"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>time_reports_pkey</strong></td>
<td>

unique or primary key constraint on columns "report_id"

</td>
</tr>
</tbody>
</table>

### time_reports_select_column

select columns of table "time_reports"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>created_at</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>period</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>project_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>report_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>total_hours</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>user_id</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### time_reports_update_column

update columns of table "time_reports"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>created_at</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>period</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>project_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>report_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>total_hours</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>user_id</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### users_constraint

unique or primary key constraints on table "users"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>users_email_key</strong></td>
<td>

unique or primary key constraint on columns "email"

</td>
</tr>
<tr>
<td valign="top"><strong>users_pkey</strong></td>
<td>

unique or primary key constraint on columns "user_id"

</td>
</tr>
</tbody>
</table>

### users_select_column

select columns of table "users"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>created_at</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>email</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>first_name</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>last_name</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>password</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>role_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>updated_at</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>user_id</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

### users_update_column

update columns of table "users"

<table>
<thead>
<tr>
<th align="left">Value</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td valign="top"><strong>created_at</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>email</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>first_name</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>last_name</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>password</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>role_id</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>updated_at</strong></td>
<td>

column name

</td>
</tr>
<tr>
<td valign="top"><strong>user_id</strong></td>
<td>

column name

</td>
</tr>
</tbody>
</table>

## Scalars

### Boolean

### Float

### Int

### String

### date

### numeric

### timestamp

### uuid

