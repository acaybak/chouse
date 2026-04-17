import 'package:flutter/material.dart';

const _mockOtpCode = '123456';
const _minPhoneLength = 10;

void main() {
  runApp(const ChouseApp());
}

class ChouseApp extends StatefulWidget {
  const ChouseApp({super.key});

  @override
  State<ChouseApp> createState() => _ChouseAppState();
}

class _ChouseAppState extends State<ChouseApp> {
  bool _isTurkish = true;
  bool _isAuthenticated = false;

  void _setLanguage(bool isTurkish) {
    setState(() {
      _isTurkish = isTurkish;
    });
  }

  void _completeOnboarding() {
    setState(() {
      _isAuthenticated = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Chouse',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.black,
          brightness: Brightness.light,
        ),
        scaffoldBackgroundColor: Colors.white,
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          surfaceTintColor: Colors.white,
          elevation: 0,
        ),
        dividerColor: const Color(0xFFEEEEEE),
      ),
      home: _isAuthenticated
          ? HomeShell(
              isTurkish: _isTurkish,
              onLanguageChanged: _setLanguage,
            )
          : OnboardingPage(
              isTurkish: _isTurkish,
              onLanguageChanged: _setLanguage,
              onAuthenticated: _completeOnboarding,
            ),
    );
  }
}

class OnboardingPage extends StatefulWidget {
  const OnboardingPage({
    super.key,
    required this.isTurkish,
    required this.onLanguageChanged,
    required this.onAuthenticated,
  });

  final bool isTurkish;
  final ValueChanged<bool> onLanguageChanged;
  final VoidCallback onAuthenticated;

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _otpController = TextEditingController();
  bool _googleDone = false;
  String? _error;

  bool get _canVerify => _googleDone && _phoneController.text.trim().isNotEmpty;

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  void _verifyOtp() {
    if (_phoneController.text.trim().length < _minPhoneLength) {
      setState(() {
        _error = UiText(widget.isTurkish).invalidPhone;
      });
      return;
    }

    if (_otpController.text.trim() == _mockOtpCode) {
      widget.onAuthenticated();
      return;
    }

    setState(() {
      _error = widget.isTurkish
          ? 'Kod hatalı. $_mockOtpCode deneyin.'
          : 'Invalid code. Try $_mockOtpCode.';
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = UiText(widget.isTurkish);
    return Scaffold(
      appBar: AppBar(
        title: Text(t.appName),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: LanguageToggle(
              isTurkish: widget.isTurkish,
              onChanged: widget.onLanguageChanged,
            ),
          ),
        ],
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(t.welcome, style: Theme.of(context).textTheme.headlineSmall),
                const SizedBox(height: 8),
                Text(t.welcomeSubtitle, style: Theme.of(context).textTheme.bodyMedium),
                const SizedBox(height: 20),
                Card(
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    side: BorderSide(color: Theme.of(context).dividerColor),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(t.googleTitle, style: Theme.of(context).textTheme.titleMedium),
                        const SizedBox(height: 8),
                        Text(t.googleHint),
                        const SizedBox(height: 12),
                        FilledButton.icon(
                          onPressed: () => setState(() {
                            _googleDone = true;
                            _error = null;
                          }),
                          icon: const Icon(Icons.login),
                          label: Text(t.googleCta),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 14),
                Card(
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    side: BorderSide(color: Theme.of(context).dividerColor),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(t.smsTitle, style: Theme.of(context).textTheme.titleMedium),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _phoneController,
                          keyboardType: TextInputType.phone,
                          onChanged: (_) => setState(() => _error = null),
                          decoration: InputDecoration(
                            border: const OutlineInputBorder(),
                            labelText: t.phoneLabel,
                          ),
                        ),
                        const SizedBox(height: 10),
                        TextField(
                          controller: _otpController,
                          keyboardType: TextInputType.number,
                          onChanged: (_) => setState(() => _error = null),
                          decoration: InputDecoration(
                            border: const OutlineInputBorder(),
                            labelText: t.otpLabel,
                            helperText: t.otpHint,
                          ),
                        ),
                        if (_error != null) ...[
                          const SizedBox(height: 8),
                          Text(_error!, style: const TextStyle(color: Colors.red)),
                        ],
                        const SizedBox(height: 12),
                        FilledButton(
                          onPressed: _canVerify ? _verifyOtp : null,
                          child: Text(t.verifyButton),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class HomeShell extends StatefulWidget {
  const HomeShell({
    super.key,
    required this.isTurkish,
    required this.onLanguageChanged,
  });

  final bool isTurkish;
  final ValueChanged<bool> onLanguageChanged;

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final t = UiText(widget.isTurkish);
    final tabTitles = [t.home, t.explore, t.qr, t.notifications, t.profile];
    final pages = [
      HomeTab(text: t),
      ExploreTab(text: t),
      QrTab(text: t),
      NotificationsTab(text: t),
      ProfileTab(
        text: t,
        isTurkish: widget.isTurkish,
        onLanguageChanged: widget.onLanguageChanged,
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(
          _index == 0 ? t.appName : tabTitles[_index],
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Divider(height: 1, color: Theme.of(context).dividerColor),
        ),
      ),
      body: pages[_index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (value) => setState(() => _index = value),
        destinations: [
          NavigationDestination(
            icon: const Icon(Icons.home_outlined),
            selectedIcon: const Icon(Icons.home),
            label: t.home,
          ),
          NavigationDestination(
            icon: const Icon(Icons.grid_view_outlined),
            selectedIcon: const Icon(Icons.grid_view),
            label: t.explore,
          ),
          NavigationDestination(
            icon: const Icon(Icons.qr_code_scanner_outlined),
            selectedIcon: const Icon(Icons.qr_code_scanner),
            label: t.qr,
          ),
          NavigationDestination(
            icon: const Icon(Icons.notifications_outlined),
            selectedIcon: const Icon(Icons.notifications),
            label: t.notifications,
          ),
          NavigationDestination(
            icon: const Icon(Icons.person_outline),
            selectedIcon: const Icon(Icons.person),
            label: t.profile,
          ),
        ],
      ),
    );
  }
}

class HomeTab extends StatelessWidget {
  const HomeTab({super.key, required this.text});

  final UiText text;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(text.walletCards, style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 10),
        const WalletCard(name: 'bosch_dealer', points: '1,240'),
        const SizedBox(height: 10),
        const WalletCard(name: 'cafe_bar', points: '350'),
        const SizedBox(height: 20),
        Text(text.featuredMenu, style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        const CompactRow(title: 'Flat White', subtitle: 'Double points until 17:00'),
        const CompactRow(title: 'Tost + Kahve', subtitle: '₺149 combo'),
        const SizedBox(height: 20),
        Text(text.recentNotifications, style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        CompactRow(title: text.orderReady, subtitle: '2m'),
        CompactRow(title: text.newCampaign, subtitle: '1h'),
      ],
    );
  }
}

class ExploreTab extends StatelessWidget {
  const ExploreTab({super.key, required this.text});

  final UiText text;

  @override
  Widget build(BuildContext context) {
    const items = [
      'Espresso',
      'Latte',
      'Cold Brew',
      'Cheesecake',
      'Sandwich',
      'Pasta',
      'Salad',
      'Lemonade',
      'Smoothie',
    ];

    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 1.2,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
      ),
      itemCount: items.length,
      itemBuilder: (context, index) {
        return Container(
          decoration: BoxDecoration(
            border: Border.all(color: Theme.of(context).dividerColor),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.restaurant_menu),
              const SizedBox(height: 8),
              Text(items[index]),
            ],
          ),
        );
      },
    );
  }
}

class QrTab extends StatelessWidget {
  const QrTab({super.key, required this.text});

  final UiText text;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(text.qrTitle, style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 16),
            Container(
              width: 220,
              height: 220,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Theme.of(context).dividerColor),
              ),
              child: const Icon(Icons.qr_code_2, size: 160),
            ),
            const SizedBox(height: 12),
            Text(
              text.qrHint,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }
}

class NotificationsTab extends StatelessWidget {
  const NotificationsTab({super.key, required this.text});

  final UiText text;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(text.today, style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        CompactRow(title: text.orderReady, subtitle: '2m'),
        CompactRow(title: text.pointsAdded, subtitle: '15m'),
        const SizedBox(height: 16),
        Text(text.thisWeek, style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        CompactRow(title: text.newCampaign, subtitle: 'Mon'),
        CompactRow(title: text.missedYou, subtitle: 'Sun'),
      ],
    );
  }
}

class ProfileTab extends StatelessWidget {
  const ProfileTab({
    super.key,
    required this.text,
    required this.isTurkish,
    required this.onLanguageChanged,
  });

  final UiText text;
  final bool isTurkish;
  final ValueChanged<bool> onLanguageChanged;

  @override
  Widget build(BuildContext context) {
    const mockUserName = 'Ayşe Demir';
    const mockHandle = '@ayse';

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          children: [
            const CircleAvatar(radius: 28, child: Icon(Icons.person)),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(mockUserName, style: Theme.of(context).textTheme.titleMedium),
                Text(mockHandle, style: Theme.of(context).textTheme.bodySmall),
              ],
            ),
          ],
        ),
        const SizedBox(height: 24),
        Text(text.language, style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        LanguageToggle(isTurkish: isTurkish, onChanged: onLanguageChanged),
      ],
    );
  }
}

class LanguageToggle extends StatelessWidget {
  const LanguageToggle({
    super.key,
    required this.isTurkish,
    required this.onChanged,
  });

  final bool isTurkish;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return SegmentedButton<bool>(
      segments: const [
        ButtonSegment(value: true, label: Text('TR')),
        ButtonSegment(value: false, label: Text('EN')),
      ],
      selected: {isTurkish},
      onSelectionChanged: (selection) {
        onChanged(selection.first);
      },
      style: SegmentedButton.styleFrom(
        visualDensity: VisualDensity.compact,
      ),
    );
  }
}

class WalletCard extends StatelessWidget {
  const WalletCard({super.key, required this.name, required this.points});

  final String name;
  final String points;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Theme.of(context).dividerColor),
      ),
      child: Row(
        children: [
          const CircleAvatar(radius: 20, child: Icon(Icons.card_membership)),
          const SizedBox(width: 12),
          Expanded(
            child: Text(name, style: Theme.of(context).textTheme.titleSmall),
          ),
          Text('$points pts', style: Theme.of(context).textTheme.labelLarge),
        ],
      ),
    );
  }
}

class CompactRow extends StatelessWidget {
  const CompactRow({super.key, required this.title, required this.subtitle});

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: const Color(0xFFF9F9F9),
      ),
      child: Row(
        children: [
          Expanded(child: Text(title)),
          Text(subtitle, style: Theme.of(context).textTheme.bodySmall),
        ],
      ),
    );
  }
}

class UiText {
  UiText(this.isTurkish);

  final bool isTurkish;

  String get appName => 'chouse';
  String get home => isTurkish ? 'Ana Sayfa' : 'Home';
  String get explore => isTurkish ? 'Keşfet' : 'Explore';
  String get qr => 'QR';
  String get notifications => isTurkish ? 'Bildirimler' : 'Notifications';
  String get profile => isTurkish ? 'Profil' : 'Profile';

  String get welcome => isTurkish ? 'Sadakat uygulamana hoş geldin' : 'Welcome to your loyalty app';
  String get welcomeSubtitle => isTurkish ? 'Google ile devam et ve SMS kodunu doğrula.' : 'Continue with Google and verify your SMS code.';
  String get googleTitle => isTurkish ? 'Google ile giriş' : 'Sign in with Google';
  String get googleHint => isTurkish ? 'Bu bir placeholder akışıdır.' : 'This is a placeholder flow.';
  String get googleCta => isTurkish ? 'Google ile devam et' : 'Continue with Google';
  String get smsTitle => isTurkish ? 'SMS doğrulama' : 'SMS verification';
  String get phoneLabel => isTurkish ? 'Telefon numarası' : 'Phone number';
  String get otpLabel => isTurkish ? 'OTP kodu' : 'OTP code';
  String get otpHint => isTurkish ? 'Mock kod: $_mockOtpCode' : 'Mock code: $_mockOtpCode';
  String get verifyButton => isTurkish ? 'Doğrula ve devam et' : 'Verify and continue';
  String get invalidPhone => isTurkish ? 'Geçerli bir telefon numarası girin.' : 'Enter a valid phone number.';

  String get walletCards => isTurkish ? 'Cüzdan kartları' : 'Wallet cards';
  String get featuredMenu => isTurkish ? 'Öne çıkan menü' : 'Featured menu';
  String get recentNotifications => isTurkish ? 'Son bildirimler' : 'Recent notifications';
  String get qrTitle => isTurkish ? 'Loyalty QR' : 'Loyalty QR';
  String get qrHint => isTurkish
      ? 'Kasada bu kodu okutun veya telefon numarasıyla eşleştirin.'
      : 'Scan this at checkout or pair with phone lookup.';
  String get today => isTurkish ? 'Bugün' : 'Today';
  String get thisWeek => isTurkish ? 'Bu hafta' : 'This week';
  String get orderReady => isTurkish ? 'Siparişiniz hazır' : 'Your order is ready';
  String get newCampaign => isTurkish ? 'Yeni kampanya başladı' : 'A new campaign started';
  String get pointsAdded => isTurkish ? 'Hesabına puan eklendi' : 'Points added to your account';
  String get missedYou => isTurkish ? 'Seni özledik, tekrar bekleriz' : 'We miss you, come by again';
  String get language => isTurkish ? 'Dil' : 'Language';
}
