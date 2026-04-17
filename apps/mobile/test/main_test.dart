import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/main.dart';

void main() {
  testWidgets('shows onboarding initially', (tester) async {
    await tester.pumpWidget(const ChouseApp());

    expect(find.text('chouse'), findsOneWidget);
    expect(find.text('Google ile devam et'), findsOneWidget);
  });

  testWidgets('can switch onboarding language to English', (tester) async {
    await tester.pumpWidget(const ChouseApp());

    await tester.tap(find.text('EN'));
    await tester.pumpAndSettle();

    expect(find.text('Continue with Google'), findsOneWidget);
  });

  testWidgets('home shell renders tabs', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: HomeShell(
          isTurkish: true,
          onLanguageChanged: _noopLanguageChanged,
        ),
      ),
    );

    expect(find.text('Ana Sayfa'), findsOneWidget);
    expect(find.text('Keşfet'), findsOneWidget);
    expect(find.text('QR'), findsOneWidget);
    expect(find.text('Bildirimler'), findsOneWidget);
    expect(find.text('Profil'), findsOneWidget);
  });
}

void _noopLanguageChanged(bool _) {}
