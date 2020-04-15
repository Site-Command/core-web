import { of as observableOf } from 'rxjs';
import { async } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { DotAppsService } from '@services/dot-apps/dot-apps.service';
import { DotAppsConfigurationDetailResolver } from './dot-apps-configuration-detail-resolver.service';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { DotMessageService } from '@services/dot-messages-service';

class AppsServicesMock {
    getConfiguration(_appKey: string, _id: string) {}
}

const activatedRouteSnapshotMock: any = jasmine.createSpyObj<ActivatedRouteSnapshot>(
    'ActivatedRouteSnapshot',
    ['toString']
);
activatedRouteSnapshotMock.paramMap = {};

describe('DotAppsConfigurationDetailResolver', () => {
    let dotAppsServices: DotAppsService;
    let dotAppsConfigurationDetailResolver: DotAppsConfigurationDetailResolver;
    const messages = {
        'apps.add.property': 'Add property',
        'apps.key': 'Key:',
        'apps.form.dialog.success.header': 'Header',
        'apps.form.dialog.success.message': 'Message',
        'ok': 'OK',
        'Cancel': 'CANCEL',
        'Save': 'SAVE'
    };
    const messageServiceMock = new MockDotMessageService(messages);

    beforeEach(async(() => {
        const testbed = DOTTestBed.configureTestingModule({
            providers: [
                DotAppsConfigurationDetailResolver,
                { provide: DotMessageService, useValue: messageServiceMock },
                { provide: DotAppsService, useClass: AppsServicesMock },
                {
                    provide: ActivatedRouteSnapshot,
                    useValue: activatedRouteSnapshotMock
                }
            ]
        });
        dotAppsServices = testbed.get(DotAppsService);
        dotAppsConfigurationDetailResolver = testbed.get(DotAppsConfigurationDetailResolver);
    }));

    it('should get and return app with configurations', () => {
        const response = {
            integrationsCount: 2,
            appKey: 'google-calendar',
            name: 'Google Calendar',
            description: 'It\'s a tool to keep track of your life\'s events',
            iconUrl: '/dA/d948d85c-3bc8-4d85-b0aa-0e989b9ae235/photo/surfer-profile.jpg',
            hosts: [
                {
                    configured: true,
                    hostId: '123',
                    hostName: 'demo.dotcms.com'
                }
            ]
        };

        const queryParams = {
            appKey: 'sampleDescriptor1',
            id: '48190c8c-42c4-46af-8d1a-0cd5db894797'
        };

        activatedRouteSnapshotMock.paramMap.get = (param: string) => {
            return param === 'appKey' ? queryParams.appKey : queryParams.id;
        };
        spyOn(dotAppsServices, 'getConfiguration').and.returnValue(observableOf(response));

        dotAppsConfigurationDetailResolver
            .resolve(activatedRouteSnapshotMock)
            .subscribe((fakeContentType: any) => {
                expect(fakeContentType).toEqual({ app: response, messages });
            });

        expect(dotAppsServices.getConfiguration).toHaveBeenCalledWith(
            queryParams.appKey,
            queryParams.id
        );
    });
});