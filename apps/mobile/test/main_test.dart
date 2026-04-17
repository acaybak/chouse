import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/main.dart';

void main() {
  testWidgets('shows onboarding initially', (tester) async {
    await tester.pumpWidget(const ChouseApp());

    expect(find.text('chouse'), findsOneWidget);
    expect(find.text('Google ile devam et'), findsOneWidget);
  });
}
