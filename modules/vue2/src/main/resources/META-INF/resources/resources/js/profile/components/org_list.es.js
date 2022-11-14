import { CwTable } from 'cw-vuejs-global-components/components/table.es';
import { TablePanel, MixinTablePanel } from 'cw-vuejs-global-components/components/table_panel.es';

export const OrgList = () => ({
    props: {
        data: { type: Array, default: () => ([]) },
    },
    cwComponents: {
        CwTable,
        TablePanel: TablePanel(),
    },
    mixins: [ MixinTablePanel ],
    data: function() {
        return {
            tableColumns: [
                { 'key': 'orgUnit', 'value': this.translate('org-unit') },
                { 'key': 'position', 'value': this.translate('position') },
                { 'key': 'teamLeader', 'value': this.translate('team-leader') }
            ],
            columnWidths: ['w-auto', 'w-25', '25']
        }
    },
    template: `
        <table-panel css-wrapper="pt-2">
            <template #body>
                <cw-table
                    :column-widths="columnWidths"
                    :columns="tableColumns"
                    :data="data"
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