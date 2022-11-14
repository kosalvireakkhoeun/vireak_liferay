import { CwTable } from 'cw-vuejs-global-components/components/table.es';
import { TablePanel, MixinTablePanel } from 'cw-vuejs-global-components/components/table_panel.es';

export const AgentList = () => ({
    props: {
        data: { type: Object, default: () => ({}) },
    },
    cwComponents: {
        CwTable,
        TablePanel: TablePanel(),
    },
    mixins: [ MixinTablePanel ],
    data: function() {
        return {
            tableColumns: [
                { 'key': 'key', 'value': 'My agents' },
                { 'key': 'value', 'value': '--' }
            ],
            columnWidths: ['w-50', 'w-50']
        }
    },
    template: `
        <table-panel :title="data.title" header-class="d-flex-column d-sm-flex">
            <template #status v-if="data.status">({{ translate('active') }})</template>
            <div class="d-flex align-items-center pt-2 pt-sm-0">
                <span>{{ translate('personnel-area') }}:&nbsp; {{ data.personnelArea }}</span>
            </div>
            <template #body>
                <cw-table
                    :column-widths="columnWidths"
                    :columns="tableColumns"
                    :data="data.agents"
                    css-table-wrapper="word-break-initial"
                    css-thead="thead--transparent font-weight-bold"
                    cssTable="font-size-14 text-black cw-table--style-dashed"
                >
                    <template slot="renderRow" slot-scope="props">
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-break">{{ itemValue(props.rowData.item, props.rowData.column) }}</span>
                        </div>
                    </template>
                </cw-table>
            </template>
        </table-panel>
    `
});
