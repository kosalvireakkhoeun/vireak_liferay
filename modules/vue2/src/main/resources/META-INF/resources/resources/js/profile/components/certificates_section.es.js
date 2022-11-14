import { CertificateOfCompletion } from 'cw-vuejs-global-components/components/certificate/certificate_of_completion.es';

export const CertificatesSection = () => ({
    cwComponents: {
        CertificateOfCompletion: CertificateOfCompletion(),
    },
    template: `
        <div>
            <template v-for="certificate in $store.state.expertise.certificates.certificates">
                <certificate-of-completion
                    v-if="certificate.showInProfile"
                    :title="certificate.courseName"
                    :icon="certificate.type + '-certificate'"
                    :type="certificate.typeLabel"
                    :description="certificate.completion"
                    css-class-wrapper="border border-rounded cec-px-4 cec-py-2 cec-mb-4">
                </certificate-of-completion>
            </template>
        </div>
    `
});
