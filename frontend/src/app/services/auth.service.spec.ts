import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should register and set cookie', () => {
    const dummyResponse = { access_token: 'token', token_type: 'bearer' };
    service.register('test@example.com', 'pwd').subscribe((res) => {
      expect(res).toEqual(dummyResponse);
    });
    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com', password: 'pwd' });
    expect(req.request.withCredentials).toBeTrue();
    req.flush(dummyResponse);
  });

  it('should login and set cookie', () => {
    const dummyResponse = { access_token: 'token', token_type: 'bearer' };
    service.login('test@example.com', 'pwd').subscribe((res) => {
      expect(res).toEqual(dummyResponse);
    });
    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(dummyResponse);
  });

  it('should logout', () => {
    service.logout().subscribe((res) => {
      expect(res).toBeTruthy();
    });
    const req = httpMock.expectOne('/api/auth/logout');
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ msg: 'Logged out' });
  });
});
