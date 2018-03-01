import { TestBed, inject } from '@angular/core/testing';

import { ConvertDocServiceService } from './convert-doc-service.service';

describe('ConvertDocServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConvertDocServiceService]
    });
  });

  it('should be created', inject([ConvertDocServiceService], (service: ConvertDocServiceService) => {
    expect(service).toBeTruthy();
  }));
});
