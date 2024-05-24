import { For, splitProps } from "solid-js";


const Table = (props: { list: any[], columns: (item?: any, index?: number) => any[] }) => {
  const [local, others] = splitProps(props, ["list", "columns"]);

  return (
    <div class="overflow-x-auto mx-4">
      <table class="table table-zebra static">
        {/* <!-- head --> */}
        <thead>
          <tr>
            <For each={local.columns()}>
              {(item) => <th>
                {item.title}
              </th>}
            </For>
          </tr>
        </thead>
        <tbody>
          <For each={local.list}>
            {(item, index) => <tr>
              <For each={local.columns(item, index() + 1)}>
                {(column) => <td>
                  {column.value}
                </td>}
              </For>
            </tr>}
          </For>
        </tbody>
      </table>
    </div>
  );
};

export default Table;