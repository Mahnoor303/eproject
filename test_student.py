import sys
import re
sys.path.insert(0, '.')
from app import app, db, User, Student, Prediction

with app.test_client() as client:
    print('=' * 60)
    print('TEST A: Register a brand-new Student')
    print('=' * 60)

    import time
    ts = str(int(time.time()))[-4:]
    r = client.post('/register', data={
        'full_name': 'Test Student Alpha',
        'email': f'alpha{ts}@test.com',
        'username': f'alpha{ts}',
        'password': 'test123',
        'confirm_password': 'test123'
    }, follow_redirects=False)
    print(f'POST /register => {r.status_code}')
    location = r.headers.get('Location', '')
    print(f'Redirected to: {location}')
    assert '/student/complete-profile' in location or '/student/academic-info' in location, f'Expected redirect to complete-profile, got {location}'
    print('PASS: Redirected to complete-profile')

    print()
    print('=' * 60)
    print('TEST B: Complete Profile form is EMPTY for new student')
    print('=' * 60)

    r = client.get('/student/complete-profile')
    html = r.data.decode()
    print(f'GET /student/complete-profile => {r.status_code}')

    for field in ['attendance', 'previous_marks', 'assignment_score', 'quiz_score', 'study_hours', 'lms_activity', 'participation']:
        pattern = f'id="{field}"[^>]*value="([^"]*)"'
        match = re.search(pattern, html)
        if match:
            val = match.group(1)
            if val == '':
                print(f'  {field} => PASS (empty)')
            else:
                print(f'  {field} => FAIL (has value: {val})')
                assert False, f'{field} has value "{val}" but should be empty'
        else:
            print(f'  {field} => PASS (no value attribute)')

    print('PASS: All form fields are empty for new student')

    print()
    print('=' * 60)
    print('TEST C: Submit academic data')
    print('=' * 60)

    r = client.post('/student/complete-profile', data={
        'attendance': '88.5',
        'previous_marks': '76.0',
        'assignment_score': '82.0',
        'quiz_score': '71.0',
        'study_hours': '12.5',
        'lms_activity': '68.0',
        'participation': '75.0'
    }, follow_redirects=False)
    print(f'POST /student/complete-profile => {r.status_code}')
    location = r.headers.get('Location', '')
    print(f'Redirected to: {location}')
    assert '/student/dashboard' in location
    print('PASS: Redirected to dashboard after saving')

    print()
    print('=' * 60)
    print('TEST D: Dashboard shows saved values (no auto-prediction)')
    print('=' * 60)

    r = client.get('/student/dashboard')
    html = r.data.decode()
    print(f'GET /student/dashboard => {r.status_code}')

    assert '88.5' in html, 'FAIL: attendance not shown'
    print('  attendance 88.5 shown => PASS')
    assert '76.0' in html, 'FAIL: previous_marks not shown'
    print('  previous_marks 76.0 shown => PASS')
    assert '82.0' in html, 'FAIL: assignment_score not shown'
    print('  assignment_score 82.0 shown => PASS')

    has_predict_btn = 'Predict My Performance' in html
    has_not_available = 'Not available yet' in html or 'No prediction' in html.lower()
    assert has_predict_btn or has_not_available, 'FAIL: no predict button or no-prediction message'
    print('PASS: No auto-prediction, predict button visible')

    print()
    print('=' * 60)
    print('TEST E: My Prediction page (no auto-prediction)')
    print('=' * 60)

    r = client.get('/student/prediction')
    html = r.data.decode()
    print(f'GET /student/prediction => {r.status_code}')
    assert 'No Prediction Generated Yet' in html or 'Predict' in html or 'Generate Initial' in html, 'FAIL: predict button not found'
    print('PASS: Prediction page shows no prediction, button visible')

    assert 'Load from Enrolled Student' not in html, 'FAIL: student dropdown text found'
    print('PASS: No student dropdown in student prediction page')

    print()
    print('=' * 60)
    print('TEST F: Run prediction (button click)')
    print('=' * 60)

    r = client.post('/student/predict', follow_redirects=False)
    print(f'POST /student/predict => {r.status_code}')
    location = r.headers.get('Location', '')
    print(f'Redirected to: {location}')
    assert '/student/prediction' in location
    print('PASS: Prediction saved, redirected to prediction page')

    r = client.get('/student/prediction')
    html = r.data.decode()
    assert 'Excellent' in html or 'Good' in html or 'Average' in html or 'At Risk' in html, 'FAIL: no prediction result shown'
    print('PASS: Prediction result displayed')

    print()
    print('=' * 60)
    print('TEST G: Prediction History shows own predictions only')
    print('=' * 60)

    r = client.get('/student/prediction-history')
    html = r.data.decode()
    print(f'GET /student/prediction-history => {r.status_code}')
    assert 'Test Student Alpha' in html or 'alpha' in html.lower(), 'FAIL: own prediction not shown'
    print('PASS: Own predictions visible in history')

    print()
    print('=' * 60)
    print('TEST H: My Academic Profile (view & edit)')
    print('=' * 60)

    r = client.get('/student/academic-profile')
    html = r.data.decode()
    print(f'GET /student/academic-profile => {r.status_code}')
    assert '88.5' in html, 'FAIL: attendance not shown in academic profile'
    print('PASS: Academic profile shows saved values')

    r = client.post('/student/academic-profile', data={
        'attendance': '92.0',
        'previous_marks': '76.0',
        'assignment_score': '82.0',
        'quiz_score': '71.0',
        'study_hours': '12.5',
        'lms_activity': '68.0',
        'participation': '75.0'
    }, follow_redirects=False)
    print(f'POST /student/academic-profile => {r.status_code}')
    assert r.status_code == 302
    print('PASS: Academic profile updated')

    r = client.get('/student/dashboard')
    html = r.data.decode()
    assert '92.0' in html, 'FAIL: updated attendance not reflected in dashboard'
    print('PASS: Updated value reflected in dashboard')

    print()
    print('=' * 60)
    print('TEST I: Profile page (view & edit)')
    print('=' * 60)

    r = client.get('/student/profile')
    html = r.data.decode()
    print(f'GET /student/profile => {r.status_code}')
    assert 'Test Student Alpha' in html or f'alpha{ts}' in html, 'FAIL: student name not shown'
    assert 'Student' in html, 'FAIL: role not shown'
    print('PASS: Profile shows account info')

    r = client.post('/student/profile', data={
        'full_name': 'Alpha Updated',
        'username': 'alpha_updated'
    }, follow_redirects=False)
    print(f'POST /student/profile => {r.status_code}')
    assert r.status_code == 302
    print('PASS: Profile updated')

    print()
    print('=' * 60)
    print('TEST J: Settings page (change password)')
    print('=' * 60)

    r = client.get('/student/settings')
    html = r.data.decode()
    print(f'GET /student/settings => {r.status_code}')
    assert 'current_password' in html, 'FAIL: password form not found'
    assert 'new_password' in html, 'FAIL: new password field not found'
    print('PASS: Settings page shows change password form')

    r = client.post('/student/settings', data={
        'current_password': 'test123',
        'new_password': 'newpass123',
        'confirm_password': 'newpass123'
    }, follow_redirects=False)
    print(f'POST /student/settings => {r.status_code}')
    assert r.status_code == 302
    print('PASS: Password changed successfully')

    print()
    print('=' * 60)
    print('TEST K: Data isolation - logout and verify redirect')
    print('=' * 60)

    client.get('/logout')
    for route in ['/student/dashboard', '/student/academic-profile', '/student/prediction', '/student/prediction-history', '/student/profile', '/student/settings']:
        r = client.get(route, follow_redirects=False)
        assert r.status_code == 302, f'FAIL: {route} returned {r.status_code} instead of redirect'
        assert '/login' in r.headers.get('Location', ''), f'FAIL: {route} did not redirect to login'
    print('PASS: All student routes redirect to login when logged out')

    print()
    print('=' * 60)
    print('TEST L: Incomplete profile - dashboard shows Not Provided')
    print('=' * 60)

    # Register a second student with incomplete profile
    client2 = app.test_client()
    client2.post('/register', data={
        'full_name': 'Test Student Beta',
        'email': f'beta{ts}@test.com',
        'username': f'beta{ts}',
        'password': 'test123',
        'confirm_password': 'test123'
    }, follow_redirects=False)

    r = client2.get('/student/dashboard')
    html = r.data.decode()
    print(f'GET /student/dashboard (incomplete) => {r.status_code}')
    assert r.status_code == 200, 'FAIL: dashboard should be accessible for incomplete profile'
    assert 'Not provided' in html, 'FAIL: should show Not Provided for empty fields'
    print('PASS: Dashboard accessible with incomplete profile, shows Not Provided')

    r = client2.get('/student/prediction')
    html = r.data.decode()
    print(f'GET /student/prediction (incomplete) => {r.status_code}')
    assert r.status_code == 200, 'FAIL: prediction page should be accessible for incomplete profile'
    print('PASS: Prediction page accessible with incomplete profile')

    print()
    print('=' * 60)
    print('TEST M: Admin/Teacher/Analyst routes NOT broken')
    print('=' * 60)

    # Login as admin
    client_admin = app.test_client()
    r = client_admin.post('/login', data={
        'username': 'admin',
        'password': 'admin123'
    }, follow_redirects=False)
    print(f'POST /login (admin) => {r.status_code}')

    r = client_admin.get('/admin/dashboard')
    print(f'GET /admin/dashboard => {r.status_code}')
    assert r.status_code == 200
    print('PASS: Admin dashboard works')

    r = client_admin.get('/admin/students')
    print(f'GET /admin/students => {r.status_code}')
    assert r.status_code == 200
    print('PASS: Admin students page works')

    print()
    print('=' * 60)
    print('ALL TESTS PASSED!')
    print('=' * 60)
