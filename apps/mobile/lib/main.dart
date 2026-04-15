import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

void main() {
  runApp(const CHouseApp());
}

class CHouseApp extends StatefulWidget {
  const CHouseApp({super.key});

  @override
  State<CHouseApp> createState() => _CHouseAppState();
}

class _CHouseAppState extends State<CHouseApp> {
  Locale _locale = const Locale('tr');

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'C House',
      locale: _locale,
      supportedLocales: const [Locale('tr'), Locale('en')],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: ThemeData(colorSchemeSeed: Colors.brown, useMaterial3: true),
      home: OnboardingScreen(
        locale: _locale,
        onLocaleChanged: (locale) => setState(() => _locale = locale),
      ),
    );
  }
}

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({
    super.key,
    required this.locale,
    required this.onLocaleChanged,
  });

  final Locale locale;
  final ValueChanged<Locale> onLocaleChanged;

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  bool signedInWithGoogle = false;
  bool phoneVerified = false;
  final phoneController = TextEditingController(text: '+905550000000');
  final otpController = TextEditingController();

  @override
  void dispose() {
    phoneController.dispose();
    otpController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final tr = widget.locale.languageCode == 'tr';

    if (signedInWithGoogle && phoneVerified) {
      return HomeScreen(locale: widget.locale, onLocaleChanged: widget.onLocaleChanged);
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('C House'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: DropdownButton<Locale>(
              value: widget.locale,
              underline: const SizedBox(),
              items: const [
                DropdownMenuItem(value: Locale('tr'), child: Text('TR')),
                DropdownMenuItem(value: Locale('en'), child: Text('EN')),
              ],
              onChanged: (value) {
                if (value != null) widget.onLocaleChanged(value);
              },
            ),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              tr ? 'Sadakat uygulamasına hoş geldiniz' : 'Welcome to loyalty app',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () => setState(() => signedInWithGoogle = true),
              icon: const Icon(Icons.login),
              label: Text(tr ? 'Google ile giriş (MVP)' : 'Sign in with Google (MVP)'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: phoneController,
              decoration: InputDecoration(labelText: tr ? 'Telefon' : 'Phone number'),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(tr ? 'Mock OTP gönderildi: 123456' : 'Mock OTP sent: 123456')),
                );
              },
              child: Text(tr ? 'SMS OTP gönder' : 'Send SMS OTP'),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: otpController,
              decoration: InputDecoration(labelText: tr ? 'OTP kodu' : 'OTP code'),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: () {
                if (otpController.text == '123456') {
                  setState(() => phoneVerified = true);
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(tr ? 'Geçersiz OTP' : 'Invalid OTP')),
                  );
                }
              },
              child: Text(tr ? 'Doğrula' : 'Verify'),
            ),
          ],
        ),
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({
    super.key,
    required this.locale,
    required this.onLocaleChanged,
  });

  final Locale locale;
  final ValueChanged<Locale> onLocaleChanged;

  @override
  Widget build(BuildContext context) {
    final tr = locale.languageCode == 'tr';

    final wallets = const [
      ('bosch_dealer', 1250, '1250.00'),
      ('cafe_bar', 540, '540.00'),
    ];

    final menu = const [
      ('Kahveler', 'Coffees', [('Latte', '120.00'), ('Americano', '95.00')]),
      ('Tatlılar', 'Desserts', [('Cheesecake', '160.00')]),
    ];

    final notifications = const [
      ('Yeni kampanya', 'New campaign', 'Bugün puanlar 2x'),
      ('Ücretsiz ürün', 'Free product', 'Latte ücretsiz hakkın var'),
    ];

    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('C House'),
          bottom: TabBar(
            tabs: [
              Tab(text: tr ? 'Cüzdanlar' : 'Wallets'),
              Tab(text: tr ? 'Menü' : 'Menu'),
              Tab(text: tr ? 'Bildirimler' : 'Notifications'),
            ],
          ),
          actions: [
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: DropdownButton<Locale>(
                value: locale,
                underline: const SizedBox(),
                items: const [
                  DropdownMenuItem(value: Locale('tr'), child: Text('TR')),
                  DropdownMenuItem(value: Locale('en'), child: Text('EN')),
                ],
                onChanged: (value) {
                  if (value != null) onLocaleChanged(value);
                },
              ),
            ),
          ],
        ),
        body: TabBarView(
          children: [
            ListView(
              padding: const EdgeInsets.all(16),
              children: wallets
                  .map(
                    (wallet) => Card(
                      child: ListTile(
                        title: Text(wallet.$1),
                        subtitle: Text('${wallet.$2} pt / ${wallet.$3} TL'),
                      ),
                    ),
                  )
                  .toList(),
            ),
            ListView(
              padding: const EdgeInsets.all(16),
              children: menu
                  .map(
                    (category) => Card(
                      child: ExpansionTile(
                        title: Text(tr ? category.$1 : category.$2),
                        children: category.$3
                            .map(
                              (item) => ListTile(
                                title: Text(item.$1),
                                subtitle: Text('${item.$2} TL'),
                              ),
                            )
                            .toList(),
                      ),
                    ),
                  )
                  .toList(),
            ),
            ListView(
              padding: const EdgeInsets.all(16),
              children: notifications
                  .map(
                    (notification) => Card(
                      child: ListTile(
                        title: Text(tr ? notification.$1 : notification.$2),
                        subtitle: Text(notification.$3),
                      ),
                    ),
                  )
                  .toList(),
            ),
          ],
        ),
      ),
    );
  }
}
